#!/usr/bin/python

"""
Created on Wed Apr 16 10:56:40 2014

Author : Deokwoo Jung
E-mail : deokwoo.jung@gmail.com
"""
from influxdb.influxdb08 import InfluxDBClient
import urllib2, datetime
from shared_constants import *
from data_tools import remove_dot
from mytool import fix_sensor_name

def read_influx_url(client, uid, start_time, end_time):
    start = datetime.datetime.fromtimestamp(start_time).strftime('%Y-%m-%d %H:%M:%S')
    end = datetime.datetime.fromtimestamp(end_time).strftime('%Y-%m-%d %H:%M:%S')
    query = "select time, value from {} where time > '{}' and time < '{}';".format(uid.replace('-', '_'), start, end)
    rawdata = client.query(query)
    values = map(lambda tsv: [tsv[0], tsv[2]],rawdata[0]['points'])
    return values

def read_sensor_data(sensor_hash, start_time, end_time):

    from log_util import log
    client = InfluxDBClient('ddea-tsdb', 8086, 'ddea', 'ddea', 'ddea')
    sensor_data = dict()
    for stitle, uid in sensor_hash.iteritems():
        tsvals = read_influx_url(client, uid, start_time, end_time)

        if tsvals is None or len(tsvals) == 0:
            log.critical(stitle + " (" + uid + ") is unavailable from " + str(start_time) + " to " + str(end_time))
        else:
            log.debug(uid + " : " + stitle + " : TS-VAL size " + str(len(tsvals)))

            """
            log.info(uid + " : " + stitle + " : TS-VAL reading saved in JSON format...")
            with open(JSON_DIR + "reading-" + uid + ".json", 'w') as f:
                f.write(simplejson.dumps(tsvals))
            """

            sensor_data.update({stitle: tsvals})

    return sensor_data






