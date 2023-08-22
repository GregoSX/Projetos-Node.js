// modulos externos
import inquirer from 'inquirer';
import chalk  from 'chalk';

// modulos internos
import fs from 'fs';
import { parse } from 'path';

operation();

function operation() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'operation',
            message: 'o que você deseja fazer?',
            choices: [
                'Criar conta',
                'Consultar saldo',
                'Depositar',
                'Sacar',
                'Sair'
            ]
        }
    ]).then(answer => {
        const operation = answer['operation'];

        if(operation == 'Criar conta') {
            createAccount();
        } else if(operation === 'Consultar saldo') {
            getAccountBalance();
        } else if(operation === 'Depositar') {
            deposit();
        } else if(operation === 'Sacar') {
            withdraw();
        } else if(operation === 'Sair') {
            console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!'));
            process.exit();
        }
    })
    .catch(err => {
        console.log(err);
    })
}

// create account
function createAccount() {
    console.log(chalk.bgGreen.black('Parabéns por escolher nosso banco!'));
    console.log(chalk.green('Defina as opções da sua conta a seguir!'));
    buildAccount();
}

function buildAccount() {
    inquirer.prompt([
        {
            name: 'nameAccount',
            message: 'Digite o nome da sua conta: ',
        }
    ]).then(answer => {
        const nameAccount = answer['nameAccount'];

        console.info(nameAccount)

        if(!fs.existsSync('./accounts')) {
            fs.mkdirSync('./accounts');
        }

        if(fs.existsSync(`./accounts/${nameAccount}.json`)) {
            console.log(chalk.bgRed.black('Esta conta já existe, escolha outro nome!'));
            buildAccount();
            return;
        }

        fs.writeFileSync(`./accounts/${nameAccount}.json`, '{"balance": 0}', 'utf8');

        console.log(chalk.green('Conta criada com sucesso!'));

        operation();
    })
    .catch(err => {
        console.log(err);
    })
}

function deposit() {
    inquirer.prompt([
        {
            name: 'nameAccount',
            message: 'Digite o nome da sua conta: ',
        }
    ])
    .then(answer => {
        const accountName = answer['nameAccount'];

        if(!checkAccount(accountName)) {
            return deposit();
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Digite o valor do depósito: ',
            }
        ])
        .then(answer => {
            const amount = answer['amount'];

            addAmount(accountName, amount);

            operation();
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err))
}

function checkAccount(accountName) {
    if(!fs.existsSync(`./accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black('Esta conta não existe, tente novamente!'));
        return false;
    }

    return true;
}

function addAmount(accountName, amount) {
    const accountData = getAccount(accountName);

    if(!amount) {
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente!'));
        return deposit();
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance);

    fs.writeFileSync(`./accounts/${accountName}.json`, JSON.stringify(accountData), 'utf8');

    console.log(chalk.green(`O depósito de ${amount} foi realizado com sucesso!`));
}

function getAccount(accountName) {
    const account = fs.readFileSync(`./accounts/${accountName}.json`, {
        encoding: 'utf8',
        flag: 'r'
    });

    return JSON.parse(account);
}

function getAccountBalance() {
    inquirer.prompt([
        {
            name: 'nameAccount',
            message: 'Digite o nome da sua conta: ',
        }
    ])
    .then(answer => {
        const accountName = answer['nameAccount'];

        if(!checkAccount(accountName)) {
            return getAccountBalance();
        }

        const accountData = getAccount(accountName);

        console.log(chalk.bgBlue.black(`O saldo da sua conta é: ${accountData.balance}`));

        operation();
    })
    .catch(err => console.log(err))
}

function withdraw() {
    inquirer.prompt([
        {
            name: 'nameAccount',
            message: 'Digite o nome da sua conta: ',
        }
    ])
    .then(answer => {
        const accountName = answer['nameAccount'];

        if(!checkAccount(accountName)) {
            return withdraw();
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Digite o valor do saque: ',
            }
        ])
        .then(answer => {
            const amount = answer['amount'];

            removeAmount(accountName, amount);
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err))
}

function removeAmount(accountName, amount) {
    const accountData = getAccount(accountName);

    if(!amount) {
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente!'));
        return withdraw();
    }

    if(parseFloat(amount) > parseFloat(accountData.balance)) {
        console.log(chalk.bgRed.black('Você não tem saldo suficiente para realizar esta operação!'));
        return withdraw();
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount);

    fs.writeFileSync(`./accounts/${accountName}.json`, JSON.stringify(accountData), 'utf8');

    console.log(chalk.green(`O saque de R$${amount} foi realizado com sucesso!`));

    operation();
}