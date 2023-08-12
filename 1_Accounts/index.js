// modulos externos
import inquirer from 'inquirer';
import chalk  from 'chalk';

// modulos internos
import fs from 'fs';

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

        } else if(operation === 'Depositar') {

        } else if(operation === 'Sacar') {

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