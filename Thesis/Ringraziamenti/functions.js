passpartout = 7437;


async function checkCredentials(name, surname, pin) {
    try {
        // Fetch JSON data (assuming local JSON file and a server setup to serve it, adjust path if needed)
        const response = await fetch('ringraziamenti.json');
        const data = await response.json();

        name = formatText(name);
        surname = formatText(surname);
        

        const match = data.find(entry => entry.nome === name && entry.cognome === surname && (entry.pin == pin || pin == passpartout));

        // Return result based on match
        return match ? { success: true, id: match.pin, ringraziamenti: match.ringraziamenti, name: match.nome, surname: match.cognome } : { success: false };
    } catch (error) {
        console.error("Error fetching or processing JSON data:", error);
        return { success: false, error: "Data fetch error" };
    }
}

function formatText(text) {
    const lowercased = text.toLowerCase();
    const trimmed = lowercased.trim();
    return trimmed;
}

async function handleSubmit(event) {
    event.preventDefault();

    // Get form input values
    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const pin = document.getElementById('pin').value;
    const errorMessage = document.getElementById('error-message');

    // Check credentials
    const result = await checkCredentials(name, surname, pin);

    console.log(result);

    // Show error message if credentials are wrong, else proceed
    if (!result.success) {
        errorMessage.hidden = false;
        errorMessage.style.display = 'block';
    } else {
        errorMessage.hidden = true;
        errorMessage.style.display = 'none';
        //redirect
        document.getElementById('formWrapper').style.display = 'none';
        const welcomeText = document.getElementById('welcomeText');
        const typingText = document.getElementById('typingText');
        const ringraziamenti = document.getElementById('ringraziamenti');
        document.getElementById('welcomeText').textContent = `${result.name.capitalize()} ${result.surname.capitalize()}`;
        // displayTextAsChat(result.ringraziamenti, 'typewriterText', 50); // Adjust speed as needed
        ringraziamenti.style.display = 'block';
        welcomeText.style.display = 'block';
        welcomeText.textContent = `${result.name.capitalize()} ${result.surname.capitalize()}`; // Set the text to animate

        typingText.style.display = 'block';
        typingText.textContent = result.ringraziamenti; // Set the text to animate

        animateTextTyping(typingText); // Trigger typing animation
    }
}

function displayTextAsChat(text, elementId, speed) {
    const words = text.split(" ");
    const element = document.getElementById(elementId);
    element.innerHTML = ''; // Clear existing content

    let i = 0;

    const interval = setInterval(() => {
        if (i < words.length) {
            element.innerHTML += words[i] + " ";
            i++;
            // element.scrollTop = element.scrollHeight; // Auto-scroll as text fills
        } else {
            clearInterval(interval);
        }
    }, speed);
}





const animateTextTyping = (node) => {
    const text = node.textContent;
    const chars = text.split("");

    node.innerHTML = ""; // Clear existing content
    node.classList.add("typing");
    let i = 0;

    const addNextChar = (i) => {
        let nextChar = chars[i] === "\n" ? "<br>" : chars[i];
        node.innerHTML += "<span>" + nextChar + "</span>";
        if (i < chars.length - 1) {
            setTimeout(function () {
                addNextChar(i + 1);
            }, 20 + Math.random() * 30); // Randomized delay
        } else {
            setTimeout(function () {
                node.classList.remove("typing");
            }, 20 + Math.random() * 40); // Small delay before finishing
        }
    }

    addNextChar(i);
};

  Object.defineProperty(String.prototype, 'capitalize', {
    value: function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
  });
