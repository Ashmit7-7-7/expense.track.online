document.addEventListener('DOMContentLoaded', function () {
    // ye humne function define kiya h like baar baar code na likhna pade isliye function block of code hota h jo ki tbhi run hota h jb usse call kiya jata h.
    const app = {  
    // const variable define krne keliye use krte h aur ismai app variable name h.
        amount: '',
        to: '',
        info: '',
        date: '',
        total: 0,
        expenses: [],
        
        init: function () {
            this.loadExpenses(); // 'this' document ki jagah use krte h jo first line mai h, dono ka kaam same hi h.
            this.updateTotal();
            document.querySelector('.form').addEventListener('submit', this.addExpense.bind(this));
            // iske madat se hum btn ko function dete h add krne ki.
            document.querySelector('.btn_danger').addEventListener('click', this.clearExpenses.bind(this));
            // isse clear krne ka.
            document.querySelector('.btn_primary').addEventListener('click', this.getCsv.bind(this));
            // isse save krne ka as a .csv(Comma Seperated Value) joki ek file h jo hum excel mai open kr skte h.
        },

        addExpense: function (event) {
            event.preventDefault();
            // Ye hai function joki use krte h add expense ke liye.
            // Update this to read values from the form inputs.
            this.amount = parseFloat(document.getElementById('amount').value) || ''; // "||" ye sign or ke liye use hota h aur and ke liye "&&" ye use hota h.
            this.to = document.getElementById('to').value;
            this.info = document.getElementById('note').value;
            this.date = document.getElementById('date').value;
        
            if (this.checkForm()) {
                alert("Please fill in all fields."); 
                // Iske wajah se agar requied field fill nhi h toh ye prompt dikhega aur add nhi hoga.
                return;
            }
        
            const data = {
                amount: this.amount,
                to: this.to,
                info: this.info,
                date: this.date
            };
        
            this.expenses.unshift(data);
            this.saveExpenses();
            this.resetForm();
            this.updateTotal();
            this.renderExpenses();
        },
        

        clearExpenses: function () {
            this.expenses = [];
            this.total = 0;
            this.saveExpenses();
            this.renderExpenses();
        },

        updateTotal: function () {
            this.total = this.expenses.reduce((sum, expense) => sum + Math.abs(expense.amount), 0);
            document.getElementById('totalAmount').textContent = `$${this.total.toFixed(2)}`;
        },

        checkForm: function () {
            return !this.amount || !this.to || !this.info || !this.date;
        },

        getCsv: function () { 
            const headers = {
            // ye function ki wajah se jb hum csv mai export karenge to ye heading rahega.
                amount: "Amount",
                to: "For",
                info: "Description",
                date: "Date"
            };

            const itemsFormatted = this.expenses.map(item => ({
            // ye variable jo bhi data rahega csv mai export karega.
                amount: item.amount,
                to: item.to,
                info: item.info,
                date: item.date
            }));

            this.exportCSVFile(headers, itemsFormatted, 'Expenses');
        },

        convertToCSV: function (objArray) {
            const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray; // JSON ka full form JavaScript Object Notation.
            let str = '';

            array.forEach(item => {
                const line = Object.values(item).join(',');
                str += line + '\r\n';
            });

            return str;
        },

        exportCSVFile: function (headers, items, fileTitle) {
            if (headers) {
                items.unshift(headers);
            }

            const csv = this.convertToCSV(JSON.stringify(items));
            const exportedFilenmae = fileTitle + '.csv';

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.setAttribute("download", exportedFilenmae);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },

        loadExpenses: function () {
            const storedExpenses = localStorage.getItem('q-vue-expenses');
            this.expenses = storedExpenses ? JSON.parse(storedExpenses) : [];
            this.renderExpenses();
        },

        saveExpenses: function () {
            localStorage.setItem('q-vue-expenses', JSON.stringify(this.expenses));
        },

        resetForm: function () {
            this.amount = '';
            this.to = '';
            this.info = '';
            this.date = '';
            this.renderFormValues();
        },

        renderFormValues: function () {
            document.getElementById('amount').value = this.amount;
            document.getElementById('to').value = this.to;
            document.getElementById('note').value = this.info;
            document.getElementById('date').value = this.date;
        },

        renderExpenses: function () {
            const expenseList = document.getElementById('expenseList');
            expenseList.innerHTML = ''; // Clear existing expenses

            this.expenses.forEach(expense => {
                const expenseDiv = document.createElement('div');
                expenseDiv.className = 'expense';
                expenseDiv.innerHTML = `
                    <p class="to"><b>To:</b> ${expense.to}</p>
                    <p class="date"><b>Date:</b> ${expense.date}</p>
                    <p class="amnt"><b>Amount:</b> $${expense.amount.toFixed(2)}</p>
                    <p class="note"><b>Note:</b> ${expense.info}</p>
                `;
                expenseList.appendChild(expenseDiv);
            });
        }
    };

    app.init(); 
    // ye humne function ko call kiya h.
    // variable name.init() call ke liye use krte h
});
