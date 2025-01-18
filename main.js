const sectionOneForm = document.getElementById("form-section-one"),
  accountHolderBox = document.getElementById("account-holder"),
  initialBalanceBox = document.getElementById("initial-balance"),
  accountListings = document.getElementById("account-listings");

// submitting form to create a new account

class BankAccount {
  constructor(accountOwner, initialBalance = 0) {
    this.accountOwner = accountOwner;
    this.balance = initialBalance;
  }

  getName() {
    return this.accountOwner;
  }
  deposit(amountToDeposit) {
    if (amountToDeposit < 0) {
      return false;
    }
    this.balance += amountToDeposit;
  }
  withdraw(amountToWithdraw) {
    if (amountToWithdraw < 0 || amountToWithdraw > this.balance) {
      return false;
    }

    this.balance -= amountToWithdraw;
  }
  transferMoney(amountToTransfer, receiverName) {
    if (amountToTransfer <= 0 || amountToTransfer > this.balance) return;
    this.balance -= amountToTransfer;
    receiverName.deposit(amountToTransfer);
  }
  getBalance() {
    return this.balance;
  }
}

// Create new accounts
let accounts = [];

function createAccount() {
  const accountHolder = accountHolderBox.value;
  const initialBalance = Number(initialBalanceBox.value);

  if (isNaN(accountHolder) && !isNaN(initialBalance)) {
    const newAccount = new BankAccount(accountHolder, initialBalance);
    accounts.push(newAccount);
    accountHolderBox.value = "";
    initialBalanceBox.value = 0;
    updatingAccount();
  }
}

function updatingAccount() {
  accountListings.innerHTML = "";
  accountsDropdown.innerHTML = "";

  accounts.forEach((account) => {
    const li = document.createElement("li");
    li.className = "account-details";
    li.textContent = `${
      account.accountOwner
    } | Balance: $${account.getBalance()}`;
    accountListings.appendChild(li);

    // create account dropdown
    const option = document.createElement("option");
    option.textContent = account.accountOwner;
    accountsDropdown.appendChild(option);
  });
}

//section B of the form..........................................
//section B of the form..........................................

const accountsDropdown = document.getElementById("account-list"),
  depositBox = document.getElementById("deposit-amount"),
  withdrawBox = document.getElementById("withdraw-amount"),
  transferAmountBox = document.getElementById("transfer-amount"),
  sectionTwoForm = document.getElementById("form-section-B"),
  receipientBox = document.getElementById("transfer-receiver");

// Submitting account transaction
sectionTwoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleTransactions();
});

sectionOneForm.addEventListener("submit", (e) => {
  e.preventDefault();
  createAccount();
});

function handleTransactions() {
  const amountToDeposit = Number(depositBox.value);
  const amountToWithdraw = Number(withdrawBox.value);
  const amountToTransfer = Number(transferAmountBox.value);
  const receipientAccountName = receipientBox.value;
  const chosenAccountName = accountsDropdown.value;

  const chosenAccount = accounts.find(
    (account) => account.accountOwner === chosenAccountName
  );

  // Depositing money
  if (!chosenAccount) return;
  if (amountToDeposit > 0) {
    chosenAccount.deposit(amountToDeposit);
    depositBox.value = "";
  }

  // withdrawing money
  if (amountToWithdraw > 0) {
    chosenAccount.withdraw(amountToWithdraw);
    withdrawBox.value = "";
  }

  // Transfering money
  if (amountToTransfer > 0 && receipientAccountName) {
    const recipientAccount = accounts.find(
      (account) => account.accountOwner === receipientAccountName
    );
    if (recipientAccount) {
      chosenAccount.transferMoney(amountToTransfer, recipientAccount);
      transferAmountBox.value = "";
      receipientBox.value = "";
    }
  }

  // To update the UI
  updatingAccount();
}
