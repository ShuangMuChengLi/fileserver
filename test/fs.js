/**
 * Created by lin on 2017/6/8.
 */
var nowDate = new Date();
var directoryName = nowDate.getFullYear() + "-" + (nowDate.getMonth()+1) + "-" + nowDate.getDate();
try {
    require('fs').mkdirSync('../uploads/' + directoryName);
} catch (e) {
    if (e.code != 'EEXIST') {
        console.error("Could not set up log directory, error was: ", e);
        process.exit(1);
    }
}