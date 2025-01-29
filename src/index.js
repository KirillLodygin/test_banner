const OBJECTS_GROUPS = [
  [
    {
      imgSrc: 'assets/images/wine.png',
      imgClass: 'wine',
      imgAlt: 'wine',
      marginLeft: '20px',
    },
    {
      imgSrc: 'assets/images/milk.png',
      imgClass: 'milk',
      imgAlt: 'milk',
      marginLeft: '7px',
    },
    {
      imgSrc: 'assets/images/jam.png',
      imgClass: 'jam',
      imgAlt: 'jam',
      marginLeft: '7px',
    },
    {
      imgSrc: 'assets/images/cheese.png',
      imgClass: 'cheese',
      imgAlt: 'cheese',
      marginLeft: '7px',
    },
  ],

  [
    {
      imgSrc: 'assets/images/meat.png',
      imgClass: 'meat',
      imgAlt: 'meat',
      marginLeft: '10px',
    },
    {
      imgSrc: 'assets/images/chicken.png',
      imgClass: 'chicken',
      imgAlt: 'chicken',
      marginLeft: '3px',
    },
    {
      imgSrc: 'assets/images/chips.png',
      imgClass: 'chips',
      imgAlt: 'chips',
      marginLeft: '3px',
    },
  ],

  [
    {
      imgSrc: 'assets/images/pineapple.png',
      imgClass: 'pineapple',
      imgAlt: 'pineapple',
      marginLeft: '15px',
    },
    {
      imgSrc: 'assets/images/bananas.png',
      imgClass: 'bananas',
      imgAlt: 'bananas',
      marginLeft: '7px',
    },
    {
      imgSrc: 'assets/images/apple.png',
      imgClass: 'apple',
      imgAlt: 'apple',
      marginLeft: '9px',
    },
    {
      imgSrc: 'assets/images/salad.png',
      imgClass: 'salad',
      imgAlt: 'salad',
      marginLeft: '8px',
    },
  ],
];

function disableDragAndDrop() {
  const objects = document.querySelectorAll('.object');
  objects.forEach((object) => {
    object.classList.remove('mouse-event-allowed');
  });

  const draggableElements = document.querySelectorAll('.object img');
  draggableElements.forEach((element) => {
    element.classList.remove('mouse-event-allowed');
  });
}

function createPlaceholderForMovedElement(movedObject) {
  const placeholder = document.createElement('div');
  placeholder.className = 'placeholder';

  const movedObjectStyles = getComputedStyle(movedObject);
  placeholder.style.width = movedObjectStyles.width;
  placeholder.style.marginLeft = movedObjectStyles.marginLeft;
  placeholder.style.marginTop = movedObjectStyles.marginTop;

  return placeholder;
}

function createProductImage(object) {
  const img = document.createElement('img');
  img.setAttribute('loading', 'lazy');
  img.src = object.imgSrc;
  img.alt = object.imgAlt;
  img.classList.add(object.imgClass);
  img.classList.add('mouse-event-allowed');

  return img;
}

function createObjectDiv() {
  const objectDiv = document.createElement('div');
  objectDiv.className = 'object';
  objectDiv.style.marginLeft = object.marginLeft;
  objectDiv.style.padding = 0;
  objectDiv.classList.add('mouse-event-allowed');

  return objectDiv;
}

function createNewContentContainer(objects, index) {
  const container = document.createElement('div');
  container.className = 'container';
  if (index === 0) {
    container.style.alignItems = 'flex-end';
    container.style.top = '0';
  }
  if (index === 1) {
    container.style.alignItems = 'flex-start';
    container.style.top = '10px';
  }
  if (index === 2) {
    container.style.alignItems = 'flex-end';
    container.style.top = '25px';
  }

  let maxHeight = 0;
  let imagesLoadedCount = 0;

  objects.forEach((object) => {
    const objectDiv = createObjectDiv();
    const img = createProductImage(object);

    objectDiv.appendChild(img);
    container.appendChild(objectDiv);

    let parentNode = null;

    img.addEventListener('dragstart', (event) => {
      parentNode = event.target.parentNode;
      parentNode.insertBefore(
        createPlaceholderForMovedElement(event.target),
        event.target,
      );
      parentNode.style.opacity = 0;
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', object.imgClass);
    });

    img.addEventListener('dragend', (event) => {
      event.preventDefault();
      parentNode.style.opacity = 1;
    });

    img.onload = () => {
      imagesLoadedCount++;
      const computedStyle = window.getComputedStyle(img);
      const heightString = computedStyle.height.replace('px', '');
      const height = parseInt(heightString);
      if (height > maxHeight) {
        maxHeight = height;
      }
      if (imagesLoadedCount === objects.length) {
        container.style.height = `${maxHeight}px`;
      }
    };
  });
  return container;
}

function createSectionDivider(index) {
  const sectionDivider = document.createElement('img');
  sectionDivider.className = index < 2 ? 'section-divider' : 'footer-image';
  sectionDivider.alt = 'footer-image';
  sectionDivider.src =
    index < 2
      ? 'assets/images/section-divider.svg'
      : 'assets/images/footer-image.svg';
  return sectionDivider
}

function createHighlightBar(index) {
  const highlightBar = document.createElement('div');
  highlightBar.className = index < 2 ? 'highlight-bar' : 'gray-separator';
  return highlightBar;
}

function createNewProductSection(objects, index) {
  const container = createNewContentContainer(objects, index);
  const sectionDivider = createSectionDivider(index);

  const highlightBar = createHighlightBar(index);

  const section = document.createElement('div');
  section.className = 'section';

  section.appendChild(container);
  section.appendChild(sectionDivider);
  section.appendChild(highlightBar);

  if (index < 2) {
    const darkBar = document.createElement('div');
    darkBar.className = 'dark-bar';
    section.appendChild(darkBar);
  }
  if (index === 0) {
    section.style.top = '0';
  }
  if (index === 1) {
    section.style.top = '150px';
  }
  if (index === 2) {
    section.style.top = '225px';
  }
  return section;
}

function createBasketEvents() {
  const basketGroup = document.querySelector('.basket-group');

  const itemsContainer = document.createElement('div');
  itemsContainer.className = 'basket-items';
  basketGroup.appendChild(itemsContainer);
  basketGroup.classList.add('mouse-event-allowed');

  basketGroup.addEventListener('dragover', (event) => {
    event.preventDefault();
  });

  basketGroup.addEventListener('drop', (event) => {
    event.preventDefault();
    // Получаем переданный класс
    const className = event.dataTransfer.getData('text/plain');
    // Находим элемент с соответствующим классом и перемещаем его в корзину
    const elementToMove = document.querySelector(`.${className}`);
    if (elementToMove) {
      itemsContainer.appendChild(elementToMove);
      elementToMove.classList.remove('mouse-event-allowed');

      if (itemsContainer.childElementCount === 3) {
        const purchaseButton = document.querySelector('.purchased-button');
        purchaseButton.style.opacity = '1';
        purchaseButton.classList.add('blink-button');
        disableDragAndDrop();
      }
    }
  });

  document
    .querySelector('.purchased-button')
    .addEventListener('click', (event) => {
      event.preventDefault();
      if (itemsContainer.childElementCount < 3) return;
      console.log('Кнопка была нажата.');
      window.location.href = 'https://lavka.yandex.ru';
    });
}

function createProductContainer() {
  const productContainer = document.querySelector('.product-container');
  OBJECTS_GROUPS.forEach((objects, index) => {
    const section = createNewProductSection(objects, index);
    productContainer.appendChild(section);
  });
}

function prohibitHighlightsOnBanner() {
  document.onselectstart = function () {
    return false;
  };
}

function initBanner() {
  createProductContainer();
  createBasketEvents();
  prohibitHighlightsOnBanner();
}

document.addEventListener('DOMContentLoaded', initBanner);
