

(function() {


    const inputs = Array.from(document.getElementsByTagName('input'));
    inputs.forEach(input => {
        input.addEventListener('change', checkValidity)
        input.addEventListener('input', e => {
            if(e.target.classList.contains('error')){
                checkValidity(e);
            }
        })
    })

    function checkValidity(e) {
        const validityState = e.target.validity;
        if(!validityState.valid) {
            const messages = getInvalidMessages(e.target);
            e.target.nextElementSibling.innerText = getStringMessages(messages);
            e.target.classList.add('error');
        } else {
            e.target.nextElementSibling.innerText = '';
            e.target.classList.remove('error');
        }
    }

    function getInvalidMessages(element) {
        const errors = [];
        if(element.value === "") {
            errors.push('This field is required');
            return errors;
        }
        if(element.type === "text") {
            element.value.length > 45 && errors.push(`The max length is 45 characters`);
            return errors;
        }
        if(element.type === "email") {
            element.validity.typeMismatch && errors.push(`The email address is invalid`);
            return errors;
        }
        if(element.type === "tel") {
            element.validity.patternMismatch && errors.push(`The phone number must be only digits`);
            element.value.length !== 10 && errors.push(`The phone number must have 10 digits`);
            return errors;
        }
        if(element.type === "password") {
            if(element.id === 'password') {
                element.value.length < 8 && errors.push(`The password must be 8 characters long`);
                const confirmPasswordInput = document.getElementById('confirm_password');
                if(confirmPasswordInput.value === "") return errors;
                element.value !== confirmPasswordInput.value && errors.push(`Passwords do not match`);
            } else {
                const password = document.getElementById('password');
                if(password.value === "") return errors;
                element.value !== password.value && errors.push(`Passwords do not match`);
            }
            return errors;
        }
    }

    function getStringMessages(messages) {
        return messages.reduce((string, message) => {
            return string += `- ${message}\n`;
        }, ``);
    }

    document.getElementById('form').addEventListener('submit', e=> {
        e.preventDefault();
        const valid = checkAllInputsValidity();
        if (!valid) return;

        const form = e.target.elements;
        const userData = {
            first_name: form.first_name.value,
            last_name: form.last_name.value,
            email: form.email.value,
            phone: form.phone.value,
            password: form.password.value,
            confirm_password: form.confirm_password.value,
        }
        console.log('All safe: ', userData);
        e.target.reset();
    })

    function checkAllInputsValidity() {
        let isValid = true;
        inputs.forEach(input => {
            const messages = getInvalidMessages(input);
            if (messages.length !== 0) {
                isValid = false;
                input.nextElementSibling.innerText = getStringMessages(messages);
                input.classList.add('error');
                if(input.type === 'password' && messages.indexOf('Passwords do not match') !== -1) {
                    input.setCustomValidity("Passwords do not match");
                } else {
                    input.setCustomValidity("");
                }
                input.reportValidity();
                input.setCustomValidity("");
            } else {
                input.setCustomValidity("");
                input.nextElementSibling.innerText = '';
                input.classList.remove('error');
                input.reportValidity();
            }
        })
        return isValid;
    }


})()