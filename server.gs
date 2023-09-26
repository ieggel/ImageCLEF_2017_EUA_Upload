function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('forms.html').setTitle("ImageCLEF 2017 End User Agreement Upload");
}

function getRegistered() {
  var url = 'http://medgift.hevs.ch:8080/CLEF2017/AllRegisteredEmails';
  var response = UrlFetchApp.fetch(url);
  return response.getContentText();
}

function uploadFileToGoogleDrive(data, file, info, email) {
  
  try {

    var dropbox = "ImageCLEF2017_EUA";
    var folder, folders = DriveApp.getFoldersByName(dropbox);
    var ext = file.split('.').pop() === file ? '' : '.'+file.split('.').pop();

    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(dropbox);
    }

    var files = folder.getFilesByName(email+ext);
    //var files = folder.searchFiles("title contains '"+email+".'");
    if (files.hasNext()){
      var file = files.next();
      file.setTrashed(true);
    }
      
    var cc = 'dogariu_mihai8@yahoo.com,bogdanlapi@gmail.com,henning.mueller@hevs.ch,ivan.eggel@hevs.ch,mauvilsa@upv.es',
        replyTo = 'dogariu_mihai8@yahoo.com',
        subject = 'ImageCLEF 2017 EUA by '+email,
        body = '',
        contentType = data.substring(5,data.indexOf(';')),
        bytes = Utilities.base64Decode(data.substr(data.indexOf('base64,')+7)),
        blob = Utilities.newBlob(bytes, contentType, email+ext),
        file = folder.createFile(blob);

    body += 'ImageCLEF 2017 End User Agreement uploaded by group ';
    body += info.groupname+' ('+info.firstname+' '+info.lastname+' <'+email+'>).';
    body += '\n'+'Please check this folder for the EUA: https://drive.google.com/drive/folders/1CHVWdRqLbaFPNxXeycdCF_ZQmbI67CMx'

    GmailApp.sendEmail(email, subject, body, {"cc": cc, "replyTo": replyTo});

    return "OK";
    
  } catch (f) {
    return f.toString();
  }
  
}