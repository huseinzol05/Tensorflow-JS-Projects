import numpy as np
import json
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

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
        weights_population = []
        for index, i in enumerate(population):
            jittered = self.sigma * i
            weights_population.append(weights[index] + jittered)
        return weights_population

    def get_weights(self):
        return self.weights

    def train(self, epoch = 100, print_every = 1):
        lasttime = time.time()
        for i in range(epoch):
            population = []
            rewards = np.zeros(self.population_size)
            for k in range(self.population_size):
                x = []
                for w in self.weights:
                    x.append(np.random.randn(*w.shape))
                population.append(x)
            for k in range(self.population_size):
                weights_population = self._get_weight_from_population(self.weights, population[k])
                rewards[k] = self.reward_function(weights_population)
            rewards = (rewards - np.mean(rewards)) / np.std(rewards)
            for index, w in enumerate(self.weights):
                A = np.array([p[index] for p in population])
                self.weights[index] = w + self.learning_rate/(self.population_size * self.sigma) * np.dot(A.T, rewards).T
            if (i+1) % print_every == 0:
                print('iter %d. reward: %f' %  (i+1, self.reward_function(self.weights)))
        print('time taken to train:', time.time()-lasttime, 'seconds')

class Model:
    def __init__(self, input_size, layer_size, output_size):
        self.weights = [np.random.randn(input_size, layer_size),
                        np.random.randn(layer_size, output_size),
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

    def __init__(self, population_size, sigma, learning_rate, model, money, max_buy, max_sell, skip, window_size, l):
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
        self.es = Deep_Evolution_Strategy(self.model.get_weights(), self.get_reward, self.POPULATION_SIZE, self.SIGMA, self.LEARNING_RATE)

    def act(self, sequence):
        decision, buy = self.model.predict(np.array(sequence))
        return np.argmax(decision[0]), int(buy[0])

    def get_reward(self, weights):
        initial_money = self.initial_money
        starting_money = initial_money
        self.model.weights = weights
        state = get_state(close, 0, self.window_size + 1)
        inventory = []
        quantity = 0
        for t in range(0,self.l,self.skip):
            action, buy = self.act(state)
            next_state = get_state(close, t + 1, self.window_size + 1)
            if action == 1 and initial_money >= close[t]:
                if buy < 0:
                    buy = 1
                if buy > self.max_buy:
                    buy_units = self.max_buy
                else:
                    buy_units = buy
                total_buy = buy_units * close[t]
                initial_money -= total_buy
                inventory.append(total_buy)
                quantity += buy_units
            elif action == 2 and len(inventory) > 0:
                if quantity > self.max_sell:
                    sell_units = self.max_sell
                else:
                    sell_units = quantity
                quantity -= sell_units
                total_sell = sell_units * close[t]
                initial_money += total_sell

            state = next_state
        return ((initial_money - starting_money) / starting_money) * 100

    def fit(self, iterations, checkpoint):
        self.es.train(iterations,print_every=checkpoint)

    def buy(self, dates):
        initial_money = self.initial_money
        state = get_state(close, 0, self.window_size + 1)
        starting_money = initial_money
        inventory = []
        quantity = 0
        states_sell_X, states_sell_Y = [], []
        states_buy_X, states_buy_Y = [], []
        outputs = []
        for t in range(0,self.l,self.skip):
            action, buy = self.act(state)
            next_state = get_state(close, t + 1, self.window_size + 1)
            if action == 1 and initial_money >= close[t]:
                if buy < 0:
                    buy = 1
                if buy > self.max_buy:
                    buy_units = self.max_buy
                else:
                    buy_units = buy
                total_buy = buy_units * close[t]
                initial_money -= total_buy
                inventory.append(total_buy)
                quantity += buy_units
                states_buy_X.push(dates[t])
                states_buy_Y.push(close[t])
                outputs.append("<tr><td>"+dates[t]+"</td><td>buy "+buy_units+" units</td><td>"+total_buy+"</td><td>NULL</td><td>"+initial_money+"</td></tr>")
                print('day %d: buy %d units at price %f, total balance %f'%(t,buy_units, total_buy,initial_money))
            elif action == 2 and len(inventory) > 0:
                bought_price = inventory.pop(0)
                if quantity > self.max_sell:
                    sell_units = self.max_sell
                else:
                    sell_units = quantity
                if sell_units < 1:
                    continue
                quantity -= sell_units
                total_sell = sell_units * close[t]
                initial_money += total_sell
                states_sell_X.push(dates[t])
                states_sell_Y.push(close[t])
                try:
                    invest = ((total_sell - bought_price) / bought_price) * 100
                except:
                    invest = 0
                outputs.push("<tr><td>"+dates[t]+"</td><td>sell "+sell_units+" units</td><td>"+total_sell+"</td><td>"+invest+"%</td><td>"+initial_money+"</td></tr>")
                print('day %d, sell %d units at price %f, investment %f %%, total balance %f,'%(t, sell_units, total_sell, invest, initial_money))
            state = next_state

        invest = ((initial_money - starting_money) / starting_money) * 100
        print('\ntotal gained %f, total investment %f %%'%(initial_money - starting_money,invest))
        return {'overall gain':(initial_money-starting_money),'overall investment':invest,
        'sell_Y':states_sell_Y,'sell_X':states_sell_X,'buy_Y':states_buy_Y,'buy_X':states_buy_X,'output':outputs}

@app.route('/uploader', methods = ['POST'])
def upload_file():
    try:
        signal = json.loads(request.form['signal'])
        l = len(signal)-1
        dates = json.loads(request.form['date'])
        layer_size = int(request.form['layer_size'])
        population_size = int(request.form['population_size'])
        sigma = float(request.form['sigma'])
        learning_rate = float(request.form['learning_rate'])
        money = float(request.form['money'])
        max_buy = int(request.form['max_buy'])
        max_sell = int(request.form['max_sell'])
        skip = int(request.form['skip'])
        window_size = int(request.form['window_size'])
        epoch = int(request.form['epoch'])
        if window_size > 30:
            return json.dumps({'error':'window_size is too big, make sure it less than 30'})
        if population_size > 40:
            return json.dumps({'error':'population_size is too big, make sure it less than 40'})
        if layer_size > 200:
            return json.dumps({'error':'layer_size is too big, make sure it less than 200'})
        if epoch > 1000:
            return json.dumps({'error':'epoch is too big, make sure it less than 1000'})
        """
        Model takes 3 parameters, input_size, layer_size, output_size
        Agent takes 9 parameters, population_size, sigma, learning_rate, model, money, max_buy, max_sell, skip, window_size
        """
        model = Model(window_size, layer_size, 3)
        agent = Agent(population_size, sigma, learning_rate, model, money, max_buy, max_sell, skip, window_size)
        agent.fit(epoch, 99999)
        return json.dumps(agent.buy(dates))
    except Exception as e:
        return json.dumps({'error':str(e)})

if __name__ == '__main__':
	app.run(host = '0.0.0.0', threaded = True, port = 8096)
