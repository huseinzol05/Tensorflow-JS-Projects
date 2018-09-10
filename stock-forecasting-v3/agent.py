import numpy as np
import json
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def detect_outliers(close, date, threshold, **kwargs):
    signal = np.abs((np.array(close) - np.mean(close)) / np.std(close))
    threshold = (np.max(signal)-np.min(signal)) * threshold
    x, y = [], []
    for i in np.where(signal>threshold)[0]:
        x.append(date[i])
        y.append(close[i])
    return {'date':x,'close':y}

def get_state(data, t, n):
    d = t - n + 1
    block = data[d:t + 1] if d >= 0 else -d * [data[0]] + data[0:t + 1]
    res = []
    for i in range(n - 1):
        res.append(block[i + 1] - block[i])
    return np.array([res])

class Deep_Evolution_Strategy:
    inputs = None
    def __init__(self, weights, reward_function, population_size, sigma, learning_rate):
        self.weights = weights
        self.reward_function = reward_function
        self.population_size = population_size
        self.sigma = sigma
        self.learning_rate = learning_rate

    def _get_weight_from_population(self, weights, population):
        return [weights[i] + self.sigma * population[i] for i in range(len(population))]

    def get_weights(self):
        return self.weights

    def train(self, epoch = 100):
        for i in range(epoch):
            population = []
            rewards = np.zeros(self.population_size)
            for k in range(self.population_size):
                population.append([np.random.randn(*self.weights[w].shape) for w in range(len(self.weights))])
            for k in range(self.population_size):
                weights_population = self._get_weight_from_population(self.weights, population[k])
                rewards[k] = self.reward_function(weights_population)
            rewards = (rewards - np.mean(rewards)) / np.std(rewards)
            for w in range(len(self.weights)):
                A = np.array([p[w] for p in population])
                self.weights[w] += self.learning_rate/(self.population_size * self.sigma) * np.dot(A.T, rewards).T

class Model:
    def __init__(self, input_size, layer_size, **kwargs):
        self.weights = [np.random.randn(input_size, layer_size),
                        np.random.randn(layer_size, 3),
                        np.random.randn(layer_size, 1),
                        np.random.randn(1, layer_size)]

    def predict(self, inputs):
        feed = np.dot(inputs, self.weights[0]) + self.weights[-1]
        decision = np.dot(feed, self.weights[1])
        buy = np.dot(feed, self.weights[2])
        return decision, buy

    def get_weights(self):
        return self.weights

    def set_weights(self, weights):
        self.weights = weights

class Agent:

    def __init__(
    self, population_size, sigma, learning_rate, model,
    money, max_buy, max_sell, skip, window_size, l, close, **kwargs):
        self.window_size = window_size
        self.skip = skip
        self.POPULATION_SIZE = population_size
        self.SIGMA = sigma
        self.LEARNING_RATE = learning_rate
        self.model = model
        self.initial_money = money
        self.max_buy = max_buy
        self.max_sell = max_sell
        self.l = l
        self.close = close
        self.es = Deep_Evolution_Strategy(
        self.model.get_weights(),
        self.get_reward,
        self.POPULATION_SIZE,
        self.SIGMA, self.LEARNING_RATE)

    def act(self, sequence):
        decision, buy = self.model.predict(np.array(sequence))
        return np.argmax(decision[0]), int(buy[0])

    def get_reward(self, weights):
        initial_money = self.initial_money
        starting_money = initial_money
        self.model.weights = weights
        state = get_state(self.close, 0, self.window_size + 1)
        inventory = []
        quantity = 0
        for t in range(0,self.l,self.skip):
            action, buy = self.act(state)
            next_state = get_state(self.close, t + 1, self.window_size + 1)
            if action == 1 and initial_money >= self.close[t]:
                if buy < 0:
                    buy = 1
                if buy > self.max_buy:
                    buy_units = self.max_buy
                else:
                    buy_units = buy
                total_buy = buy_units * self.close[t]
                initial_money -= total_buy
                inventory.append(total_buy)
                quantity += buy_units
            elif action == 2 and len(inventory) > 0:
                if quantity > self.max_sell:
                    sell_units = self.max_sell
                else:
                    sell_units = quantity
                quantity -= sell_units
                total_sell = sell_units * self.close[t]
                initial_money += total_sell

            state = next_state
        return ((initial_money - starting_money) / starting_money) * 100

    def fit(self, iterations):
        self.es.train(iterations)

    def buy(self, dates):
        initial_money = self.initial_money
        state = get_state(self.close, 0, self.window_size + 1)
        starting_money = initial_money
        inventory = []
        quantity = 0
        states_sell_X, states_sell_Y = [], []
        states_buy_X, states_buy_Y = [], []
        outputs = []
        for t in range(0,self.l,self.skip):
            action, buy = self.act(state)
            next_state = get_state(self.close, t + 1, self.window_size + 1)
            if action == 1 and initial_money >= self.close[t]:
                if buy < 0:
                    buy = 1
                if buy > self.max_buy:
                    buy_units = self.max_buy
                else:
                    buy_units = buy
                total_buy = buy_units * self.close[t]
                initial_money -= total_buy
                inventory.append(total_buy)
                quantity += buy_units
                states_buy_X.append(dates[t])
                states_buy_Y.append(self.close[t])
                outputs.append("<tr><td>"+dates[t] \
                +"</td><td>buy "+str(buy_units)+" units</td><td>" \
                +str(total_buy)+"</td><td>NULL</td><td>" \
                +str(initial_money)+"</td></tr>")
            elif action == 2 and len(inventory) > 0:
                bought_price = inventory.pop(0)
                if quantity > self.max_sell:
                    sell_units = self.max_sell
                else:
                    sell_units = quantity
                if sell_units < 1:
                    continue
                quantity -= sell_units
                total_sell = sell_units * self.close[t]
                initial_money += total_sell
                states_sell_X.append(dates[t])
                states_sell_Y.append(self.close[t])
                try:
                    invest = ((total_sell - bought_price) / bought_price) * 100
                except:
                    invest = 0
                outputs.append("<tr><td>"+dates[t] \
                +"</td><td>sell "+str(sell_units)+" units</td><td>" \
                +str(total_sell)+"</td><td>"+str(invest)+"%</td><td>"+str(initial_money)+"</td></tr>")
            state = next_state

        invest = ((initial_money - starting_money) / starting_money) * 100
        return {'overall gain':(initial_money-starting_money),
        'overall investment':invest,
        'sell_Y':states_sell_Y,'sell_X':states_sell_X,
        'buy_Y':states_buy_Y,'buy_X':states_buy_X,'output':outputs}

@app.route('/stock', methods = ['POST'])
def upload_file():
    try:
        stock_data = json.loads(request.form['data'])
        stock_data['l'] = len(stock_data['close'])-1
        stock_data['input_size'] = stock_data['window_size']
        if stock_data['window_size'] > 30:
            return json.dumps({'error':'window_size is too big, make sure it less than 30'})
        if stock_data['population_size'] > 40:
            return json.dumps({'error':'population_size is too big, make sure it less than 40'})
        if stock_data['layer_size'] > 200:
            return json.dumps({'error':'layer_size is too big, make sure it less than 200'})
        if stock_data['epoch'] > 100:
            return json.dumps({'error':'epoch is too big, make sure it less than 100'})
        """
        Model takes 2 parameters, input_size, layer_size

        Agent takes 9 parameters, population_size, sigma, learning_rate,
        model, money, max_buy, max_sell, skip, window_size, close

        Targeted every request not more than 10 sec.
        """
        model = Model(**stock_data)
        stock_data['model'] = model
        agent = Agent(**stock_data)
        agent.fit(stock_data['epoch'])
        return json.dumps(
        {'agent':agent.buy(stock_data['date']),
        'outliers':detect_outliers(**stock_data)
        })
    except Exception as e:
        return json.dumps({'error':str(e)})

application = app
