// Definição de Funções Exportadas
export {getReadBookList, createReadBookList, registerBook}

// Definição de funções back-end
   // Função de resgate da lista
   function getReadBookList(){
      const readBookList = localStorage.getItem('readBookList');
      if (readBookList === null){
         return []
      } else {
         return JSON.parse(readBookList);
      }
   }

   // Função criar lista
   function createReadBookList(book, appendCallback){
      const bookElement = {
         tableRow: document.createElement('tr'),
         collumnOne: document.createElement('td'),
         collumnTwo: document.createElement('td'),
         collumnThr: document.createElement('td'),
         collumnFou: document.createElement('td'),
         collumnFiv: document.createElement('td'),
         collumnSix: document.createElement('td')
      }

      // Definindo conteúdo das colunas
      bookElement.collumnTwo.textContent = book.name;
      bookElement.collumnThr.textContent = book.autor;
      bookElement.collumnFiv.textContent = book.pages;
      switch (book.type){
         case "BookType1":
            bookElement.collumnFou.textContent = "Ficção"
            break;
         case "BookType2":
            bookElement.collumnFou.textContent = "Desenvolvimento"
            break;
      }
      const bookBtn = document.createElement('i');
         bookBtn.classList.add("btnEditBook", "btn", "btn-dark", "bi", "bi-pencil-square");
         bookBtn.setAttribute('type', "button");

      appendCallback(bookElement, bookBtn);
   }

   // Função de registro de livro Lido
   function registerBook(nameValue, autorValue, pagesValue, typeValue){
      try {
         console.log("Registrando o livro...");
         const readBooks = getReadBookList();
         if (readBooks.some((book) => book.name === nameValue)) throw new Error("O livro já existe na sua lista");
         const readBookOBJ = {
            name: nameValue,
            autor: autorValue,
            pages: pagesValue,
            type: typeValue
         }
         readBooks.push(readBookOBJ);
         localStorage.setItem('readBookList', JSON.stringify(readBooks));
         console.log("Livro cadastrado!");
      } catch (err){
         alert(`Ocorreu um erro\n${err.message}`);
      }
   }
