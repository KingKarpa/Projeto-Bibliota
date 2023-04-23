// Definição de Constantes Essenciais
   // Primeira tabela de dados 
const numOfReadBooks = document.getElementById('numberReadBook');
const numOfReadPages = document.getElementById('numberReadPage');
const numOfBookToRead = document.getElementById('numberBookToRead');
   // Segunda tabela de dados
const graphOfReadBooksTypes = document.getElementById('graphReadBookTypes');
const numOfReadBooksType1 = document.getElementById('numberReadBookType1');
const numOfReadBooksType2 = document.getElementById('numberReadBookType2');
   // Botões desencadeadores
const btnShowReadBookForm = document.getElementById('btnShowReadBookFormCanvas');
const btnReadBookRegister = document.getElementById('btnReadBookRegister');
const btnBookDelete = document.getElementById('btnBookDelete');
const bSendReadBackup = document.getElementById('btnSendReadListBackup');
   // OffCanvas
const readBookCanvas = document.getElementById('readBookFormCanvas');
const editBookCanvas = document.getElementById('bookEditCanvas');
   // Formulários
const readBookForm = document.getElementById('readBookForm');
const editBookForm = document.getElementById('bookEditForm');
   // Inputs e Select do Formulário de cadastro
const inputBookName = document.getElementById('inputBookName');
const inputBookAutor = document.getElementById('inputBookAutor');
const inputBookPages = document.getElementById('inputBookPages');
const selectBookType = document.getElementById('selectBookType');
   // Inputs e Select do Formulário de Edição
const iEditBookName = document.getElementById('inputEditBookName');
const iEditBookAutor = document.getElementById('inputEditBookAutor');
const iEditBookPages = document.getElementById('inputEditBookPages');
const sEditBookType = document.getElementById('selectEditBookType');
   // Tabela de dados
const tableReadBookList = document.getElementById('tableReadBook');

import {getReadBookList, createReadBookList, registerBook} from './script-readbook.js';

try {
   window.onload = generateReadData();


   readBookCanvas.addEventListener('hide.bs.offcanvas', () => {
      readBookForm.reset();
      readBookForm.classList.remove("was-validated");
   });

   editBookCanvas.addEventListener('hide.bs.offcanvas', () => {
      editBookForm.reset();
      editBookForm.classList.remove("was-validated");
   });

   readBookForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (readBookForm.checkValidity()){
         const iBookNameValue = inputBookName.value;
         const iBookAutorValue = inputBookAutor.value;
         const iBookPagesValue = inputBookPages.value;
         const sBookTypeValue = selectBookType.value;
         registerBook(iBookNameValue, iBookAutorValue, iBookPagesValue, sBookTypeValue);
         generateReadData();
      }
   });

   bSendReadBackup.addEventListener('click', () => {
      console.log("Executando envio de backup");
      const ireadBackup = document.getElementById('inputReadListBackup');
      if (ireadBackup.files.length > 0){
         if (ireadBackup.files[0].type === 'application/json'  && ireadBackup.files[0].name.endsWith('.json')){
            localStorage.removeItem('readBookList');
            const fileReader = new FileReader();
            fileReader.readAsText(ireadBackup.files[0], 'UTF-8');
            fileReader.onload = function (evt) {
               const json = JSON.parse(evt.target.result);
               localStorage.setItem('readBookList', JSON.stringify(json));
               ireadBackup.value = '';
               generateReadData();
            }
         } else {
            console.log("Arquivo não é um JSON");
         }
      } else {
         console.log("Arquivo Inexistente")
      }
   })

} catch (err){
   alert(`Ocorreu um erro\n${err.message}`);
}

   function generateReadData() {
      const readBooks = getReadBookList();
      if (readBooks !== []){
         generateReadStatus(readBooks);
         while (tableReadBookList.firstChild){
            tableReadBookList.removeChild(tableReadBookList.firstChild);
         }
         readBooks.forEach((book) => {
            createReadBookList(book, (bookElement, btnEditBook) => {
               bookElement.collumnOne.textContent = readBooks.indexOf(book) + 1;
               btnEditBook.setAttribute('data-bs-toggle', "offcanvas");
               btnEditBook.setAttribute('data-bs-target', "#bookEditCanvas");
               btnEditBook.addEventListener("click", e => getBookElement(e.target));
               bookElement.collumnSix.appendChild(btnEditBook);
               
               bookElement.tableRow.appendChild(bookElement.collumnOne);
               bookElement.tableRow.appendChild(bookElement.collumnTwo);
               bookElement.tableRow.appendChild(bookElement.collumnThr);
               bookElement.tableRow.appendChild(bookElement.collumnFou);
               bookElement.tableRow.appendChild(bookElement.collumnFiv);
               bookElement.tableRow.appendChild(bookElement.collumnSix);
               tableReadBookList.appendChild(bookElement.tableRow);
               prepareReadListBackup(readBooks);
            });
         })
      }
   }

   function generateReadStatus(readBooks){
      const readBooksType1 = [];
      const readBooksType2 = [];
      let readPages = 0;
      readBooks.forEach((book) => {
         readPages += parseInt(book.pages);
         if (book.type == "BookType1") readBooksType1.push(book)
         if (book.type == "BookType2") readBooksType2.push(book)
      })
      numOfReadBooks.textContent = readBooks.length;
      numOfReadBooksType1.textContent = readBooksType1.length;
      numOfReadBooksType2.textContent = readBooksType2.length;
      numOfReadPages.textContent = readPages;
   }

   function getBookElement(e){
      const elementoPai = e.parentElement;
      const elementoAvo = elementoPai.parentElement;
      const eBookIndex = parseInt(elementoAvo.firstChild.innerHTML) - 1;
      const readBooks = getReadBookList();
      btnBookDelete.addEventListener('click', function eventDelete() {
         deleteBook(eBookIndex, readBooks);
         btnBookDelete.removeEventListener('click', eventDelete);
      });
      editBook(readBooks[eBookIndex], readBooks);
   }

   function editBook(bookTarget, readBooks){
      iEditBookName.value = bookTarget.name;
      iEditBookAutor.value = bookTarget.autor;
      iEditBookPages.value = bookTarget.pages;
      sEditBookType.value = bookTarget.type;
      editBookForm.addEventListener('submit', (e) => {
         e.preventDefault();
         if (editBookForm.checkValidity()){
            bookTarget.name = iEditBookName.value;
            bookTarget.autor = iEditBookAutor.value;
            bookTarget.pages = iEditBookPages.value;
            bookTarget.type = sEditBookType.value;
            localStorage.setItem('readBookList', JSON.stringify(readBooks));
            generateReadData();
         }
      })
   }

   function deleteBook(bookIndex, readBooks){
      readBooks.splice(bookIndex, 1);
      localStorage.setItem('readBookList', JSON.stringify(readBooks));
      generateReadData();
      editBookCanvas.classList.add('hide');
   }

   function prepareReadListBackup(readBooks){
      const btnReadListBackup = document.getElementById('btnReadListBackup');
      const blob = new Blob([JSON.stringify(readBooks)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      btnReadListBackup.href = url;
      btnReadListBackup.download = "backup-livros-lidos.json";
   }