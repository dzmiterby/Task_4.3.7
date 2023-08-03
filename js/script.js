const inpEnter = document.querySelector('.main__enter-input');
const enterList = document.querySelector('.main__enter-list');
const outList = document.querySelector('.main__out-list');

// Получить ответ с GitHub
async function getResultFromGitHub(value) {
    if (value.trim() === '') {
        enterList.innerHTML = '';
    } else {
        try {
            let request = `?q=${value}`;
            let response = await fetch(`https://api.github.com/search/repositories${request}`);
            if (response.ok) {
                let json = await response.json();
                handleJsonGidHub(json);
            } else {
                enterList.innerHTML = 'Сервер временно не доступен';
                return null;
            }
        } catch (error) {
            return null;
        }
    }    
}

// Обработать ответ GitHub
function handleJsonGidHub(value) {
    let result = [];
    for (let i = 0; i < 5; i++) {
        let obj = {};
        obj.name = value.items[i].name;
        obj.owner = value.items[i].owner.login;
        obj.stars = value.items[i].stargazers_count;
        result.push(obj);
    }
    drawEnterList(result);
}

// Отрисовать выпадающий список
function drawEnterList(value) {
    enterList.innerHTML = '';
    for (let i = 0; i < value.length; i++) {
        enterList.innerHTML += `<li class="main__enter-li" data-name="${value[i].name}" data-owner="${value[i].owner}" data-stars="${value[i].stars}">${value[i].name}</li>`;
    }
}

// Добавление элементов в outlist
enterList.addEventListener('click', function (event) {
    if (event.target) {
        outList.innerHTML += `  <li class="main__out-li">
                                    <div>
                                        <p>Name: <span>${event.target.dataset.name}</span></p>
                                        <p>Owner: <span>${event.target.dataset.owner}</span></p>
                                        <p>Stars: <span>${event.target.dataset.stars}</span></p>
                                    </div>
                                    <button class="main__button-close" type="button"></button>
                                </li>`;
        inpEnter.value = '';
        this.innerHTML = '';
    }
})

// Удаление элемента из outlist
outList.addEventListener('click', function (event) {
    if (event.target.className === 'main__button-close') {
        event.target.parentNode.remove();
    }
})

// Функция debounce
const debounce = (fn, debounceTime) => {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(context, args), debounceTime);
    }
}

// Получить значение из input и отправить запрос на GitHub
inpEnter.addEventListener('input', function () {
    debounce(getResultFromGitHub(this.value), 500);
})