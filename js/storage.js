// Sistema de Armazenamento Local
class Storage {
    constructor() {
        this.keys = {
            USERS: 'catalogo_usuarios',
            PRODUCTS: 'catalogo_produtos',
            CONTATOS: 'catalogo_contatos'
        };
        
        this.init();
    }

    init() {
        console.log('Storage inicializado');
        
        // Inicializa os dados se não existirem
        if (!this.getUsers()) {
            this.saveUsers([]);
            console.log('Lista de usuários inicializada');
        }
        
        if (!this.getProducts()) {
            this.saveProducts([]);
            console.log('Lista de produtos inicializada');
        }
        
        if (!this.getContatos()) {
            this.saveContatos([]);
            console.log('Lista de contatos inicializada');
        }
        
        console.log('Dados carregados:', {
            usuarios: this.getUsers().length,
            produtos: this.getProducts().length,
            contatos: this.getContatos().length
        });
    }

    // ========== MÉTODOS PARA USUÁRIOS ==========
    saveUser(userData) {
        try {
            const users = this.getUsers();
            
            // Adiciona ID e timestamp se não existirem
            const userCompleto = {
                id: Date.now(), // ID único baseado no timestamp
                ...userData,
                dataCriacao: new Date().toLocaleString('pt-BR'),
                dataAtualizacao: new Date().toLocaleString('pt-BR')
            };
            
            users.push(userCompleto);
            this.saveUsers(users);
            
            console.log('Usuário salvo:', userCompleto);
            return userCompleto;
            
        } catch (error) {
            console.error('Erro ao salvar usuário:', error);
            return null;
        }
    }

    getUsers() {
        try {
            const users = localStorage.getItem(this.keys.USERS);
            return users ? JSON.parse(users) : [];
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            return [];
        }
    }

    saveUsers(users) {
        try {
            localStorage.setItem(this.keys.USERS, JSON.stringify(users));
            return true;
        } catch (error) {
            console.error('Erro ao salvar lista de usuários:', error);
            return false;
        }
    }

    getUserById(userId) {
        const users = this.getUsers();
        return users.find(user => user.id === userId);
    }

    updateUser(userId, updatedData) {
        const users = this.getUsers();
        const userIndex = users.findIndex(user => user.id === userId);
        
        if (userIndex !== -1) {
            users[userIndex] = {
                ...users[userIndex],
                ...updatedData,
                dataAtualizacao: new Date().toLocaleString('pt-BR')
            };
            
            this.saveUsers(users);
            console.log('Usuário atualizado:', users[userIndex]);
            return users[userIndex];
        }
        
        return null;
    }

    deleteUser(userId) {
        const users = this.getUsers().filter(user => user.id !== userId);
        this.saveUsers(users);
        console.log('Usuário deletado:', userId);
        return true;
    }

    // ========== MÉTODOS PARA PRODUTOS ==========
    saveProduct(productData) {
        try {
            const products = this.getProducts();
            
            const productCompleto = {
                id: Date.now(),
                ...productData,
                dataCriacao: new Date().toLocaleString('pt-BR'),
                dataAtualizacao: new Date().toLocaleString('pt-BR')
            };
            
            products.push(productCompleto);
            this.saveProducts(products);
            
            console.log('Produto salvo:', productCompleto);
            return productCompleto;
            
        } catch (error) {
            console.error('Erro ao salvar produto:', error);
            return null;
        }
    }

    getProducts() {
        try {
            const products = localStorage.getItem(this.keys.PRODUCTS);
            return products ? JSON.parse(products) : [];
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            return [];
        }
    }

    saveProducts(products) {
        try {
            localStorage.setItem(this.keys.PRODUCTS, JSON.stringify(products));
            return true;
        } catch (error) {
            console.error('Erro ao salvar lista de produtos:', error);
            return false;
        }
    }

    getProductById(productId) {
        const products = this.getProducts();
        return products.find(product => product.id === productId);
    }

    updateProduct(productId, updatedData) {
        const products = this.getProducts();
        const productIndex = products.findIndex(product => product.id === productId);
        
        if (productIndex !== -1) {
            products[productIndex] = {
                ...products[productIndex],
                ...updatedData,
                dataAtualizacao: new Date().toLocaleString('pt-BR')
            };
            
            this.saveProducts(products);
            console.log('Produto atualizado:', products[productIndex]);
            return products[productIndex];
        }
        
        return null;
    }

    deleteProduct(productId) {
        const products = this.getProducts().filter(product => product.id !== productId);
        this.saveProducts(products);
        console.log('Produto deletado:', productId);
        return true;
    }

    // ========== MÉTODOS PARA CONTATOS ==========
    saveContato(contatoData) {
        try {
            const contatos = this.getContatos();
            
            const contatoCompleto = {
                id: Date.now(),
                ...contatoData,
                dataEnvio: new Date().toLocaleString('pt-BR')
            };
            
            contatos.push(contatoCompleto);
            this.saveContatos(contatos);
            
            console.log('Contato salvo:', contatoCompleto);
            return contatoCompleto;
            
        } catch (error) {
            console.error('Erro ao salvar contato:', error);
            return null;
        }
    }

    getContatos() {
        try {
            const contatos = localStorage.getItem(this.keys.CONTATOS);
            return contatos ? JSON.parse(contatos) : [];
        } catch (error) {
            console.error('Erro ao carregar contatos:', error);
            return [];
        }
    }

    saveContatos(contatos) {
        try {
            localStorage.setItem(this.keys.CONTATOS, JSON.stringify(contatos));
            return true;
        } catch (error) {
            console.error('Erro ao salvar lista de contatos:', error);
            return false;
        }
    }

    // ========== MÉTODOS UTILITÁRIOS ==========
    getEstatisticas() {
        return {
            totalUsuarios: this.getUsers().length,
            totalProdutos: this.getProducts().length,
            totalContatos: this.getContatos().length,
            dataAtualizacao: new Date().toLocaleString('pt-BR')
        };
    }

    exportarDados() {
        return {
            usuarios: this.getUsers(),
            produtos: this.getProducts(),
            contatos: this.getContatos(),
            dataExportacao: new Date().toISOString(),
            versao: '1.0'
        };
    }

    importarDados(dados) {
        try {
            if (dados.usuarios) this.saveUsers(dados.usuarios);
            if (dados.produtos) this.saveProducts(dados.produtos);
            if (dados.contatos) this.saveContatos(dados.contatos);
            
            console.log('Dados importados com sucesso');
            return true;
        } catch (error) {
            console.error('Erro ao importar dados:', error);
            return false;
        }
    }

    limparTodosDados() {
        try {
            localStorage.removeItem(this.keys.USERS);
            localStorage.removeItem(this.keys.PRODUCTS);
            localStorage.removeItem(this.keys.CONTATOS);
            this.init(); // Reinicializa com arrays vazios
            
            console.log('Todos os dados foram limpos');
            return true;
        } catch (error) {
            console.error('Erro ao limpar dados:', error);
            return false;
        }
    }

    // Backup automático
    fazerBackup() {
        const backup = this.exportarDados();
        localStorage.setItem('catalogo_backup', JSON.stringify(backup));
        console.log('Backup realizado:', backup);
        return backup;
    }

    restaurarBackup() {
        try {
            const backup = localStorage.getItem('catalogo_backup');
            if (backup) {
                return this.importarDados(JSON.parse(backup));
            }
            return false;
        } catch (error) {
            console.error('Erro ao restaurar backup:', error);
            return false;
        }
    }
}

// Teste rápido do storage
console.log('=== STORAGE CARREGADO ===');