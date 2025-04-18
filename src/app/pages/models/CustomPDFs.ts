
const Head =   `
<head>
  <title>SOMMAVI</title>
  <meta name="viewport" content="width=10000, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
   <link rel="stylesheet"
  href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
  integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/fontawesome.min.css" 
  integrity="sha512-RvQxwf+3zJuNwl4e0sZjQeX7kUa3o82bDETpgVCH2RiwYSZVDdFJ7N/woNigN/ldyOOoKw8584jM4plQdt8bhA==" 
  crossorigin="anonymous" referrerpolicy="no-referrer" />
  
</head>`

export class CustomPDFs{
    constructor() {}

    static transferStockPDF(printContents,titre){
        return `
      <html>
      `+Head+`
        <body onload="window.print();">
          <div class="container col-8" style="font-size: 18px">
          <h2 class="text-center text-uppercase">`+titre+`</h2>
          <hr>
          `+printContents+`
          </div>
        </body>
      </html>`
    }
}
