// Módulo para manejo de datos de usuarios
class DataHandler {
    static async loadUserData() {
        try {
            const response = await fetch('https://scrabblescratch.github.io/UDB_LIC941_Proyecto_ATM/data/data.json');
            return await response.json();
        } catch (error) {
            console.error('Error cargando datos:', error);
            return [];
        }
    }

    static async validatePin(pin) {
        const users = await this.loadUserData();
        return users.find(user => user.pin == pin);
    }

    static setCurrentUser(user) {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
    }

    static getCurrentUser() {
        return JSON.parse(sessionStorage.getItem('currentUser'));
    }

    static clearSession() {
        sessionStorage.removeItem('currentUser');
    }

    static deposit(amount, description) {
        try {
            const user = this.getCurrentUser();
            if (!user) return null;

            user.balance += amount;

            const transaction = {
                id: crypto.randomUUID(),
                type: 'deposit',
                amount: amount,
                date: new Date().toISOString(),
                description: description,
                balance: user.balance
            };

            if (!user.transactions) {
                user.transactions = [];
            }
            user.transactions.push(transaction);

            this.setCurrentUser(user);
            return transaction.id;
        } catch (error) {
            console.error('Error en depósito:', error);
            return null;
        }
    }

    static withdraw(amount, description) {
        try {
            const user = this.getCurrentUser();
            if (!user) return null;

            if (user.balance < amount) {
                return null;
            }

            user.balance -= amount;

            const transaction = {
                id: crypto.randomUUID(),
                type: 'withdrawal',
                amount: amount,
                date: new Date().toISOString(),
                description: description,
                balance: user.balance
            };

            if (!user.transactions) {
                user.transactions = [];
            }
            user.transactions.push(transaction);

            this.setCurrentUser(user);
            return transaction.id;
        } catch (error) {
            console.error('Error en retiro:', error);
            return null;
        }
    }

    static paymentService(amount, description) {
        try {
            const user = this.getCurrentUser();
            if (!user) return null;

            if (user.balance < amount) {
                return null;
            }

            user.balance -= amount;

            const transaction = {
                id: crypto.randomUUID(),
                type: 'payment',
                amount: amount,
                date: new Date().toISOString(),
                description: description,
                balance: user.balance
            };

            if (!user.transactions) {
                user.transactions = [];
            }
            user.transactions.push(transaction);

            this.setCurrentUser(user);
            return transaction.id;
        } catch (error) {
            console.error('Error en pago de servicio:', error);
            return null;
        }
    }

    static getBalance() {
        try {
            const user = this.getCurrentUser();
            return user ? user.balance : 0;
        } catch (error) {
            console.error('Error obteniendo balance:', error);
            return 0;
        }
    }

    static getTransaction(id) {
        try {
            const user = this.getCurrentUser();
            if (!user || !user.transactions) return null;

            return user.transactions.find(t => t.id === id);
        } catch (error) {
            console.error('Error obteniendo transacción:', error);
            return null;
        }
    }
}
