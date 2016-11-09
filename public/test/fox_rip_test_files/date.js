    var mydate=new Date()
    var year=mydate.getYear()
    if (year < 1000)
    year+=1900
    var day=mydate.getDay()
    var month=mydate.getMonth()
    var daym=mydate.getDate()
    if (daym<10)
    daym="0"+daym
    var dayarray=new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday")
    var montharray=new Array("January","February","March","April","May","June","July","August","September","October","November","December")
    //document.write(""+daym+" "+montharray[month]+" "+year+"")
    // var newdate = daym+" "+montharray[month]+" "+year;
    var newdate = dayarray[day]+", "+montharray[month]+" "+daym+", "+year;
    $('.current-date').text( newdate );

    var mydate=new Date()
    var year=mydate.getYear()
    if (year < 1000)
    year+=1900
    var day=mydate.getDay()-1
    var month=mydate.getMonth()
    var daym=mydate.getDate()-1
    if (daym<10)
    daym="0"+daym
    var dayarray=new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday")
    var montharray=new Array("January","February","March","April","May","June","July","August","September","October","November","December")
    //document.write(""+daym+" "+montharray[month]+" "+year+"")
     //var newdate2 = daym+" "+montharray[month]+" "+year;
     var newdate2 = dayarray[day]+", "+montharray[month]+" "+daym+", "+year;
    $('.current-date-minus').text( newdate2 );