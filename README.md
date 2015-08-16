# iinet
A reversed engineered unofficial [iinet](www.iinet.net.au) library to access the toolbox

Example
=======
```javascript
var iinet = require("./iinet.js")
iinet.logon(username,password, function (error, toolbox) {
  if(!error)
    toolbox.volumeUsageByMonth(tasknumber,new Date(),function(error,volume) {
      console.log(volume)
    })
  toolbox.logout(function(err) {})
}
  )
```
