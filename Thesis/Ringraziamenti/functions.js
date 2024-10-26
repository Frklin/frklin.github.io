passpartout = 7437;


async function checkCredentials(name, surname, pin) {
    try {
        // Fetch JSON data (assuming local JSON file and a server setup to serve it, adjust path if needed)
        const response = await fetch('ringraziamenti.json');
        const data = await response.json();

        name = formatText(name);
        surname = formatText(surname);
        

        const match = data.find(entry => entry.nome === name && entry.cognome === surname && (entry.pin == pin || pin == passpartout));

        const group = match.gruppo;
        const group_ack = data.find(entry => entry.gruppo === group && entry.nome === "ACK" && entry.cognome === "ACK");

        // Return result based on match
        return match ? { success: true, id: match.pin, ringraziamenti: match.ringraziamenti, name: match.nome, surname: match.cognome, group: match.gruppo, group_ack: group_ack.ringraziamenti } : { success: false };
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
        // const ringraziamenti_group = document.getElementById('ringraziamenti_group');
        const group = document.getElementById('welcomeTextGroup');
        const group_ack = document.getElementById('typingTextGroup');
        const signature = "Francesco";

        document.getElementById('welcomeTextGroup').textContent = `${result.group.capitalize()}`;

        if (result.group_ack !== '') {
            if (result.ringraziamenti !== '') {
                // add the signature to the end of result.ringraziamenti
                result.ringraziamenti += `\n\n${signature}`;
            } else {
                // add the signature to the end of result.group_ack
                result.group_ack += `\n\n${signature}`;
            }
        } else {
            // add the signature to the end of result.ringraziamenti
            result.ringraziamenti += `\n\n${signature}`;
        }
        
        ringraziamenti.style.display = 'block';

        console.log(result.group_ack);

        if (result.group_ack !== '') {
            group.style.display = 'block';
            group_ack.style.display = 'block';
            group.textContent = `${result.group.capitalize()}`;
            group_ack.textContent = result.group_ack;
        } else {  
            group.style.display = 'none';
            group_ack.style.display = 'none';
        }
        
        if (result.ringraziamenti !== '') {
            animateTextTyping(group_ack, () => {
                document.getElementById('welcomeText').textContent = `${result.name.capitalize()} ${result.surname.capitalize()}`;
                // Display the second group of elements after the first animation finishes
                    welcomeText.style.display = 'block';
                    welcomeText.textContent = `${result.name.capitalize()} ${result.surname.capitalize()}`;
                
                    typingText.style.display = 'block';
                    typingText.textContent = result.ringraziamenti;
                
                    // Start the second typing animation
                    animateTextTyping(typingText);

                });
        } else {
            animateTextTyping(group_ack);
        }
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





function animateTextTyping(node, callback) {
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
            }, 10 + Math.random() * 4); // Randomized delay
        } else {
            setTimeout(function () {
                node.classList.remove("typing");
                if (callback) callback(); // Call callback after animation completes
            }, 20 + Math.random() * 10);
        }
    };

    addNextChar(i);
}

  Object.defineProperty(String.prototype, 'capitalize', {
    value: function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
  });
