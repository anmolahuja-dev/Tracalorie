//Storage Controller
const StorageCtrl=(function(){
    //PUblic Methods
    return{
        storeItem: function(newItem){
            let items;
            if(localStorage.getItem('items')===null){
                items=[];
                //push new item
                items.push(newItem);
                //set local storage
                localStorage.setItem('items',JSON.stringify(items));
            }
            else{
                items=JSON.parse(localStorage.getItem('items'));

                //push new item
                items.push(newItem);

                //set local storage
                localStorage.setItem('items',JSON.stringify(items));
            }

            let totalCalories=0;
            if(localStorage.getItem('totalCalories')===null){
                totalCalories=newItem.calories;
                localStorage.setItem('totalCalories',JSON.stringify(totalCalories));
            }
            else{
                totalCalories=JSON.parse(localStorage.getItem('totalCalories'));
                totalCalories+=newItem.calories;
                localStorage.setItem('totalCalories',JSON.stringify(totalCalories));
            }
        },
        getItemFromStorage: function(){
            let items;
            if(localStorage.getItem('items')===null){
                items=[];
            }
            else{
                items=JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        getTotalCaloriesFromStorage: function(){
            let totalCalories;
            if(localStorage.getItem('totalCalories')===null){
                totalCalories=0;
            }
            else{
                totalCalories=JSON.parse(localStorage.getItem('totalCalories'));
            }
            return totalCalories;
        },

        updateItemStorage: function(updatedItem){
            let items =JSON.parse(localStorage.getItem('items'));
            let totalCalories = JSON.parse(localStorage.getItem('totalCalories'));
            items.forEach(function(item,index){
                if(updatedItem.id===item.id){
                    
                    //update calories
                    totalCalories-=item.calories;
                    totalCalories+=updatedItem.calories;
                    //update item (this is another variation of splice function)
                    items.splice(index,1,updatedItem);
                }
            });
            //reset local Storage
            localStorage.setItem('items',JSON.stringify(items));
            localStorage.setItem('totalCalories',JSON.stringify(totalCalories));
        },

        deleteItemFromStorage: function(id){
            let items =JSON.parse(localStorage.getItem('items'));
            let totalCalories = JSON.parse(localStorage.getItem('totalCalories'));
            items.forEach(function(item,index){
                if(id===item.id){
                    //update calories
                    totalCalories-=item.calories;
                    
                    //update item (this is another variation of splice function)
                    items.splice(index,1);
                    
                }
            });
            //reset local Storage
            localStorage.setItem('items',JSON.stringify(items));
            localStorage.setItem('totalCalories',JSON.stringify(totalCalories));
        },
        clearItemsFromStorage: function(){
            localStorage.removeItem('items');
            localStorage.removeItem('totalCalories');
        }
    }
})();

//Item Controller
const ItemCtrl = (function(){
    //Item constructor

    const Item = function(id,name,calories){
        this.id= id;
        this.name=name;
        this.calories=calories;
    }

    //Data Structure / State
    const data = {
        // items:[],
        items:StorageCtrl.getItemFromStorage(),
        currentItem:null,
        //totalCalories:0
        totalCalories: StorageCtrl.getTotalCaloriesFromStorage()
    }

    //Public Methods
    return {
        getItems: function(){
            return data.items;
        },
        getTotalCalories: ()=>{
            return data.totalCalories;
        },
        getCurrentItem:()=>{
            return data.currentItem;
        },
        getItemById: function(id){
            let found=null;
            data.items.forEach((item)=>{
                if(item.id === id){
                    found=item;
                }
            })
            return found;
        },
        setCurrentItem: function(item){
            data.currentItem=item;
        },
        addItem: function(name,calories){
            //create Id
            if(data.items.length>0){
                Id=data.items[data.items.length-1].id + 1;
            }
            else{
                Id = 0;
            }
            //calories to Number
            calories = parseInt(calories);

            newItem =  new Item(Id,name,calories);

            //Add to items array
            data.items.push(newItem);

            //Add calorie value to Total Calories
            data.totalCalories += calories;

            return newItem;
        },
        updateItem: function(name,calories){
            //calories to number
            calories= parseInt(calories);

            let found= null;
            data.items.forEach((item)=>{
                if(item.id===data.currentItem.id){
                    
                    //update total calories
                    data.totalCalories-=item.calories;
                    data.totalCalories+=calories;

                    item.name = name;
                    item.calories = calories;

                    found=item;
                }
            });

            return found;
        },
        deleteItem: function(id){
            // Get ids
            const ids = data.items.map(function(item){
                return item.id;
            });

            //Get index
            const index= ids.indexOf(id);

            //Update totalCalories
            data.totalCalories-= data.items[index].calories;

            //Remove Item (Here we used splice method in which we passed two args)
            //the first arg is the staring index of the items from which we wanna delete
            //second index is the number of items we wanna delete from that starting index
            data.items.splice(index,1);

        },

        clearAllItemsDS:function(){
            data.items= [];
            data.totalCalories=0;
        },

        logData: function(){
            return data;
        }
    }

})();

//Ui controller
const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn:'.back-btn',
        clearBtn:'.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCals: '.total-calories',
        nameInputErr:'.name-input-error',
        calInputErr:'.calorie-input-error'
    } 
    //public Methods
    return {
        populateItemList: function(items){
            let html='';

            items.forEach(item => {
                html+= `
                <li id="item-${item.id}" class="collection-item">
                    <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-edit"></i>
                    </a>
                </li>
                `
            });

            document.querySelector(UISelectors.itemList).innerHTML=html; //UISelector is used so that just in case if the id of UL is changed we can change it in object and the changes will be effective right away

            document.querySelector(UISelectors.totalCals).textContent=ItemCtrl.getTotalCalories();
        },

        getItemInput: function(){
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories:document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },

        addListItem: function(item){
            //Show the list 
            document.querySelector(UISelectors.itemList).style.display='block';
            //create li element
            const li = document.createElement('li');
            li.className='collection-item';
            li.id=`item-${item.id}`;

            li.innerHTML = `
                <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-edit"></i>
                </a>
            `;
            //insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li);
        },

        updateListItem:function(item){
            let listItems= document.querySelectorAll(UISelectors.listItems);

            //Turn Node list to array
            listItems= Array.from(listItems);

            listItems.forEach((listItem)=>{
                const itemId = listItem.getAttribute('id');

                if(itemId===`item-${item.id}`){
                    document.querySelector(`#${itemId}`).innerHTML= `
                        <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                            <i class="edit-item fa fa-edit"></i>
                        </a>
                    ` ;
                }
            });
        },

        deleteListItem: function(id){
            const itemId= `#item-${id}`;
            const item = document.querySelector(itemId);
            item.remove();
        },

        updateTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCals).textContent= totalCalories;  
        },
    
        clearFields: function(){
            document.querySelector(UISelectors.itemNameInput).value='';
            document.querySelector(UISelectors.itemCaloriesInput).value='';
        },

        addItemToForm: function(){
            const currItem = ItemCtrl.getCurrentItem();
            document.querySelector(UISelectors.itemNameInput).value=currItem.name;
            document.querySelector(UISelectors.itemCaloriesInput).value=currItem.calories;
        },

        showEditState: function(){
            document.querySelector(UISelectors.addBtn).style.display='none';
            document.querySelector(UISelectors.updateBtn).style.display='inline';
            document.querySelector(UISelectors.deleteBtn).style.display='inline';
            document.querySelector(UISelectors.backBtn).style.display='inline';
        },

        showError: function(place){
            if(place==='name'){
                document.querySelector(UISelectors.itemNameInput).style.borderColor='red';
                document.querySelector(UISelectors.nameInputErr).style.display='inline';
            }
            else if(place==='cals'){
                document.querySelector(UISelectors.itemCaloriesInput).style.borderColor='red';
                document.querySelector(UISelectors.calInputErr).style.display='inline';
            }
            else{
                document.querySelector(UISelectors.itemNameInput).style.borderColor='red';
                document.querySelector(UISelectors.itemCaloriesInput).style.borderColor='red';
                document.querySelector(UISelectors.nameInputErr).style.display='inline';
                document.querySelector(UISelectors.calInputErr).style.display='inline';
            }
        },

        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display='none';
        },

        hideEditButtons: function(){
            document.querySelector(UISelectors.addBtn).style.display='inline';
            document.querySelector(UISelectors.updateBtn).style.display='none';
            document.querySelector(UISelectors.deleteBtn).style.display='none';
            document.querySelector(UISelectors.backBtn).style.display='none';
        },

        hideInputErrors: function(){
            document.querySelector(UISelectors.calInputErr).style.display='none';
            document.querySelector(UISelectors.nameInputErr).style.display='none';
        },
        clearUI : function(){

            let listItems=  document.querySelectorAll(UISelectors.listItems);

            //turn node list into array
            listItems= Array.from(listItems);

            listItems.forEach((item)=>{
                item.remove();
            });
        },

        getSelectors :function(){
            return UISelectors;
        }
    }
})();

//App Controller
const App = (function(ItemCtrl,UICtrl,StorageCtrl){
    // Load Event Listeners
    const loadEventListeners = () => {
        //get ui selectors
        const UISelectors = UICtrl.getSelectors();

        //Add item Event
        document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit);

        //hide input error on adding value to it
        document.querySelector(UISelectors.itemNameInput).addEventListener('keyup',function(e){
            UICtrl.hideInputErrors();
            document.querySelector(UISelectors.itemNameInput).style.borderColor='grey';
            document.querySelector(UISelectors.itemCaloriesInput).style.borderColor='grey';
        });
        document.querySelector(UISelectors.itemCaloriesInput).addEventListener('keyup',function(e){
            UICtrl.hideInputErrors();
            document.querySelector(UISelectors.itemNameInput).style.borderColor='grey';
            document.querySelector(UISelectors.itemCaloriesInput).style.borderColor='grey';
        });

        //Disable submit on enter
        document.addEventListener('keypress',function(e){
            if(e.keyCode===13 || e.which===13){
                e.preventDefault();
                return false;
            }
        });

        //Add edit Event
        document.querySelector(UISelectors.itemList).addEventListener('click',editItems);

        //Update Item Event
        document.querySelector(UISelectors.updateBtn).addEventListener('click',itemUpdateSubmit);

        //Delete Item Event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDeleteSubmit);

        //Back Button Event
        document.querySelector(UISelectors.backBtn).addEventListener('click',function(e){
            UICtrl.clearFields();
            UICtrl.hideEditButtons();
        });

        //Clear Button Event
        document.querySelector(UISelectors.clearBtn).addEventListener('click',clearAllItems);

    }

    //Add Item Submit
    const itemAddSubmit = (e)=>{
        //Get form input from UICtrl
        const input = UICtrl.getItemInput();
        
        //Validate Input
        if(input.name==='' || input.calories ===''){
            let place;
            if(input.name==='' && input.calories ===''){
                place='both';
            }
            else if(input.name===''){
                place='name';
            }
            else{
                place='cals';
            }
            UICtrl.showError(place);
        }
        else{
            //Add Item
            const newItem = ItemCtrl.addItem(input.name,input.calories);
            
            //Get Total calories
            const totalCalories= ItemCtrl.getTotalCalories();

            //Add Item to UI list
            UICtrl.addListItem(newItem);
            
            //Update Total Calories
            UICtrl.updateTotalCalories(totalCalories);

            //Store in local Storage
            StorageCtrl.storeItem(newItem);

            //clear Fields
            UICtrl.clearFields();
        }

        e.preventDefault();
    }

    //edit items in the list
    const editItems = function(e){
        if(e.target.classList.contains('edit-item')){
            //clear Edit fields and update buttons
            UICtrl.showEditState();
            
            //Get list Item id
            const listID = e.target.parentNode.parentNode.id;

            //Break into an array(just to get id number)
            const listIdArr = listID.split('-');

            //Get the actual id
            const id = parseInt(listIdArr[1]);
            
            // Get item
            const itemToEdit = ItemCtrl.getItemById(id);

            //set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            //Add Item to form
            UICtrl.addItemToForm();

        }
        e.preventDefault();
    }

    //update Items
    const itemUpdateSubmit= function(e){
        //Get item input
        const input = UICtrl.getItemInput();

        //Update Item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        //Update item in UI
        UICtrl.updateListItem(updatedItem);

        //Get Total calories
        const totalCalories= ItemCtrl.getTotalCalories();

        console.log(totalCalories);
        //Update Total Calories
        UICtrl.updateTotalCalories(totalCalories);

        //Update local Storage
        StorageCtrl.updateItemStorage(updatedItem);
        
        //clear input fields in ui
        UICtrl.clearFields();

        //hide edit buttons
        UICtrl.hideEditButtons();

        e.preventDefault();
    }

    //Delete Item
    const itemDeleteSubmit = function(e){
        //Get current Item
        const currentItem = ItemCtrl.getCurrentItem();

        //Delete data from structure
        ItemCtrl.deleteItem(currentItem.id);

        //Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        //Get Total calories
        const totalCalories= ItemCtrl.getTotalCalories();

        //Update Total Calories
        UICtrl.updateTotalCalories(totalCalories);

        //Delete from local storage
        StorageCtrl.deleteItemFromStorage(currentItem.id);
        
        //clear input fields in ui
        UICtrl.clearFields();

        //hide edit buttons
        UICtrl.hideEditButtons();

        e.preventDefault();
    }

    //clear items Event
    const clearAllItems= function(){
        //Delele all items from Data structure
        ItemCtrl.clearAllItemsDS();

        //clear UI
        UICtrl.clearUI();

        //Get Total calories
        const totalCalories= ItemCtrl.getTotalCalories();

        //Update Total Calories
        UICtrl.updateTotalCalories(totalCalories);

        //clear local storage
        StorageCtrl.clearItemsFromStorage();
        
        //clear input fields in ui
        UICtrl.clearFields();

        //hide edit buttons
        UICtrl.hideEditButtons();

        //hide the UL
        UICtrl.hideList();
    }
    
    //Public Methods
    return {
        init: function(){

            //fetch items from data structure
            const Items=ItemCtrl.getItems();

            //hide edit buttons
            UICtrl.hideEditButtons();

            //hide input errors
            UICtrl.hideInputErrors();
            
            //check if any items are there
            if(Items.length===0){
                UICtrl.hideList();
            }
            else{
                //populate list with item
                UICtrl.populateItemList(Items);
            }

            //load Event listeners
            loadEventListeners();
        }
    }
})(ItemCtrl,UICtrl,StorageCtrl);

//Initializing APp
App.init();