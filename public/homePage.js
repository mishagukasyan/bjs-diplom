'use strict';

const logoutButton = new LogoutButton();
logoutButton.action = function () {
    ApiConnector.logout(function (response) {
        if (response.success === true) {
            location.reload();
        }
    })
};

ApiConnector.current(function (response) {
    if (response.success === true) {
        ProfileWidget.showProfile(response.data);
    }
});

const ratesBoards = new RatesBoard();

function getCurrencies() {
    ApiConnector.getStocks(function (response) {
        if (response.success === true) {
            ratesBoards.clearTable();
            ratesBoards.fillTable(response.data);
        }
    })
}

getCurrencies();
setInterval(getCurrencies, 60000);

const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = function (data) {
    ApiConnector.addMoney(data, function (response) {
        if (response.success === false) {
            moneyManager.setMessage(true, response.data);
        } else {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(false, "Баланс успешно пополнен");
        }
    })
};
moneyManager.conversionMoneyCallback = function (data) {
    ApiConnector.convertMoney(data, function (response) {
        if (response.success === false) {
            moneyManager.setMessage(true, response.data);
        } else {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(false, "Валюта успешно сконвертирована");
        }
    })
};
moneyManager.sendMoneyCallback = function (data) {
    ApiConnector.transferMoney(data, function (response) {
        if (response.success === false) {
            moneyManager.setMessage(true, response.data);
        } else {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(false, "Перевод валюты успешно произведен");
        }
    })
};

const favoritesWidget = new FavoritesWidget();
ApiConnector.getFavorites(function (response) {
    if (response.success === true) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    }
});
favoritesWidget.addUserCallback = function (data) {
    ApiConnector.addUserToFavorites(data, function (response) {
        if (response.success === false) {
            favoritesWidget.setMessage(true, response.data);
        } else {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            moneyManager.setMessage(true, "Пользователь успешно добавлен");
        }
    })
};
favoritesWidget.removeUserCallback = function (id) {
    ApiConnector.removeUserFromFavorites(id, function (response) {
        if (response.success === false) {
            favoritesWidget.setMessage(true, response.data);
        } else {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            moneyManager.setMessage(true, "Пользователь успешно удален");
        }
    });
};
