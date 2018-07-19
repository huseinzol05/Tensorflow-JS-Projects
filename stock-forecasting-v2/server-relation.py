import json
from flask import Flask, render_template, request
from werkzeug import secure_filename
from flask_cors import CORS
import numpy as np
import pandas as pd
import datetime
import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler

app = Flask(__name__)
CORS(app)

last_update = datetime.date.today()
columns = ['Date','Open','High','Low','Close']
columns_selected = ['Buy','Sell','Decision','close','DCOILWTICO','DDFUELUSGULF','DGASUSGULF','GOLDAMGBD228NLBM', 'DHOILNYH', 'DJFUELUSGULF', 'DHHNGSP', 'DPROPANEMBTX']
columns_selected_inverted = ['Crude Oil','Diesel','Gasoline','Gold','Heating Oil','Kerosene','Natural Gas','Propane']
crude = pd.read_csv('historical/crude-oil.csv').replace(to_replace='.', value=0)
diesel = pd.read_csv('historical/Diesel-Fuel.csv').replace(to_replace='.', value=0)
gasoline = pd.read_csv('historical/Gasoline.csv').replace(to_replace='.', value=0)
gold = pd.read_csv('historical/gold.csv').replace(to_replace='.', value=0)
heating_oil = pd.read_csv('historical/Heating-Oil.csv').replace(to_replace='.', value=0)
kerosene = pd.read_csv('historical/Kerosene-Type-Jet-Fuel.csv').replace(to_replace='.', value=0)
natural_gas = pd.read_csv('historical/Natural-Gas-Spot.csv').replace(to_replace='.', value=0)
propane = pd.read_csv('historical/propane.csv').replace(to_replace='.', value=0)
crude['DATE'] = pd.to_datetime(crude['DATE'], errors='coerce')
diesel['DATE'] = pd.to_datetime(diesel['DATE'], errors='coerce')
gasoline['DATE'] = pd.to_datetime(gasoline['DATE'], errors='coerce')
gold['DATE'] = pd.to_datetime(gold['DATE'], errors='coerce')
heating_oil['DATE'] = pd.to_datetime(heating_oil['DATE'], errors='coerce')
kerosene['DATE'] = pd.to_datetime(kerosene['DATE'], errors='coerce')
natural_gas['DATE'] = pd.to_datetime(natural_gas['DATE'], errors='coerce')
propane['DATE'] = pd.to_datetime(propane['DATE'], errors='coerce')

@app.route('/uploader', methods = ['POST'])
def upload_file():
    if request.method == 'POST':
        date = json.loads(request.form['date'])
        close = json.loads(request.form['close'])
        df = pd.DataFrame({'close':close,'Date':date})
        rolling = int(request.form['rolling'])
        df['Date'] = pd.to_datetime(df['Date'])
        df.index = df['Date']
        df['Sell'] = np.zeros(df.shape[0])
        df['Buy'] = np.zeros(df.shape[0])
        df['Decision'] = np.zeros(df.shape[0])
        df['RollingMax'] = df.close.shift(1).rolling(rolling, min_periods=rolling).max()
        df['RollingMin'] = df.close.shift(1).rolling(rolling, min_periods=rolling).min()
        df.loc[df['RollingMax'] < df.close, 'Sell'] = -1
        df.loc[df['RollingMin'] > df.close, 'Buy'] = 1
        df.loc[df['RollingMax'] < df.close, 'Decision'] = 1
        df.loc[df['RollingMin'] > df.close, 'Decision'] = 2
        buy = df['Buy'].values.tolist()
        sell = df['Sell'].values.tolist()
        df = df.iloc[:,:5]
        df.Date = pd.to_datetime(df.Date)
        df.index = df.Date
        df = df.merge(crude, left_on='Date', right_on='DATE')
        df = df.merge(diesel, left_on='Date', right_on='DATE')
        df = df.merge(gasoline, left_on='Date', right_on='DATE')
        df = df.merge(gold, left_on='Date', right_on='DATE')
        df = df.merge(heating_oil, left_on='Date', right_on='DATE')
        df = df.merge(kerosene, left_on='Date', right_on='DATE')
        df = df.merge(natural_gas, left_on='Date', right_on='DATE')
        df = df.merge(propane, left_on='Date', right_on='DATE')
        correlation = df[columns_selected[3:]].astype('float').corr().values
        df_copy = df[columns_selected[3:]].copy()
        df_copy.index = df.Date
        df_copy.iloc[:,:]=MinMaxScaler().fit_transform(df_copy)
        resampled_mean = df_copy.resample('M').sum()
        pct_changes = resampled_mean.pct_change().values[1:,0].tolist()
        dates = resampled_mean.pct_change().index
        df.index = df.Date
        movement_changes = []
        for i in range(len(dates)-1):
            movement_changes.append({'title':'%s to %s'%(dates[i].strftime('%Y-%m-%d'),dates[i+1].strftime('%Y-%m-%d')),
                                     'movement':df.loc[dates[i]:dates[i+1]].close.values.tolist()})
        list_mean_label = resampled_mean.index.strftime('%Y-%m-%d').tolist()
        list_mean = resampled_mean.values.T.tolist()
        data_stack = [['data']+list_mean_label]
        for no, i in enumerate(columns_selected_inverted):
            data_stack.append([i]+list_mean[no])
        df = df[columns_selected]
        df=df.replace('.', np.nan)
        df = df.dropna()
        outter = []
        decision = df.Decision.values
        for i in ['close']:
            for k in columns_selected[3:]:
                val = []
                X = df[k].values.astype('float64')
                Y = df[i].values.astype('float64')
                if i == k:
                    for no, out in enumerate(np.unique(decision)):
                        weights = np.ones_like(X[decision == out])/float(len(X[decision == out]))
                        n, bins, _ = plt.hist(X[decision == out], min(100,X[decision == out].shape[0]),weights=weights)
                        plt.cla()
                        val.append([bins.tolist(), n.tolist()])
                else:
                    for no, out in enumerate(np.unique(decision)):
                        val.append([X[decision == out].tolist(), Y[decision == out].tolist()])
                outter.append(val)
        return json.dumps({'pairplot':outter,'pi':correlation[0,1:].tolist(),
                           'data_stack':data_stack,
                           'pct_changes':pct_changes,
                           'movement_changes':movement_changes})
    else:
        return json.dumps({'error': 'Only accept POST'})

if __name__ == '__main__':
    app.run(host = '0.0.0.0', threaded = True, port = 8070)
