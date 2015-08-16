var request = require('request');
var baby = require('babyparse');

function getMonthFormatted(date) {
    var month = date.getMonth() + 1;
    return month < 10 ? '0' + month : '' + month; // ('' + month) for string result
}

function getYearFormatted(date) {
    var month = date.getFullYear();
    return '' + month; // ('' + month) for string result
}
exports.iinetDateFormat = function(date) {
    return getYearFormatted(date) + getMonthFormatted(date)
}

exports.logon = function(username, password, callback) {

    return request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: 'https://toolbox3.iinet.net.au/login',
            body: "ReturnUrl=%2F&Username=" + encodeURIComponent(username) + "&Password=" + encodeURIComponent(password) + "&action%3AIndex=",
        }, function(error, response, body) {
            if (!error) {
                callback(null, {
                        'volumeUsageByMonthCSV': function(task, date, c2) {
                            var myCookie = request.cookie(response.headers['set-cookie'][0]);

                            var cookieJar = request.jar();
                            cookieJar.setCookie(myCookie, 'https://toolbox3.iinet.net.au/login');

                            request.post({
                                headers: {
                                    'content-type': 'application/x-www-form-urlencoded'
                                },
                                jar: cookieJar,
                                url: 'https://toolbox3.iinet.net.au/broadband/volumeusage/' + task + '/dailycsv',
                                body: "month=" + exports.iinetDateFormat(date) + "&downloadId=daily-csv"
                            }, function(e, r, b) {
                                if (e)
                                    c2(e)
                                else
                                    c2(null, b);

                            });
                        },
                        'volumeUsageByMonth' : function(task,date,c2) {
                            this.volumeUsageByMonthCSV(task,date, function(err,csv) {
                                if(err) {
                                    c2(err)
                                } else {
                                    c2(null,baby.parse(csv))
                                }

                            }) 
                        }
                        ,
                        
                        'logout': function(c2) {
                            var myCookie = request.cookie(response.headers['set-cookie'][0]);

                            var cookieJar = request.jar();
                            cookieJar.setCookie(myCookie, 'https://toolbox3.iinet.net.au/login');

                            request.get({
                                jar: cookieJar,
                                url: 'https://toolbox3.iinet.net.au/logout',
                            }, function(e, r, b) {
                                c2(e)

                            });
                        }
                    }

                )
            } else {
                callback(error)
            }
        }

    );
}

//exports.ParseVolumeUsage = function(string) {}