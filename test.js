mergeInto(LibraryManager.library, {
    OpenPrintWindow: function (tickNum, additionalTextPtr, dateAndTimePtr) {
      const contentStr = UTF8ToString(tickNum);
      const additionalText = UTF8ToString(additionalTextPtr);
      const dateAndTime = UTF8ToString(dateAndTimePtr);
  
      // Split contentStr and dateAndTime into arrays
      const contentStrArray = contentStr.split(',');
      const dateAndTimeArray = dateAndTime.split(',');
  
      console.log("Received contentStrArray:", contentStrArray); // Log the received data
      console.log("Received additionalText:", additionalText);
      console.log("Received dateAndTimeArray:", dateAndTimeArray);
  
      // Function to load the JsBarcode library dynamically
      function loadJsBarcodeLibrary(callback) {
        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/jsbarcode/latest/JsBarcode.all.min.js';
        script.onload = callback;
        document.head.appendChild(script);
      }
  
      // Load the JsBarcode library and use it once it's loaded
      loadJsBarcodeLibrary(function () {
        // JsBarcode library is now loaded and available
  
        // Create a new window and open it
        var barcodeWindow = window.open('', '_blank');
  
        // Check if the new window was successfully opened
        if (barcodeWindow) {
          // Create a function to load the barcode images
          function loadBarcodeImages(index) {
            if (index < contentStrArray.length) {
              var barcodeImage = new Image();
              JsBarcode(barcodeImage, contentStrArray[index], {
                format: "CODE128",
                displayValue: true,
              });
  
              // Set an onload event handler for the barcode image
              barcodeImage.onload = function () {
                // Write the barcode image to the new window
                barcodeWindow.document.write('<img src="' + barcodeImage.src + '">');
  
                // Print dateAndTime and ticketNo
                barcodeWindow.document.write('<p>drawtime: ' + dateAndTimeArray[index] + '</p>');
                barcodeWindow.document.write('<p>ticketNo: ' + contentStrArray[index] + '</p>');
  
                // Include additionalText below the barcode for this entry
                barcodeWindow.document.write('<p>' + additionalText + '</p');
  
                // Add two line breaks to separate barcode entries
                barcodeWindow.document.write('<br><br>');
  
                // Load the next barcode image
                loadBarcodeImages(index + 1);
              };
  
              // Handle any errors that might occur while loading the barcode image
              barcodeImage.onerror = function () {
                alert('Failed to generate the barcode image.');
              };
            } else {
              // All barcode images are loaded, close the document and print
              barcodeWindow.document.close();
  
              // Automatically open the print dialog
              barcodeWindow.print();
            }
          }
  
          // Start loading the barcode images from index 0
          loadBarcodeImages(0);
        } else {
          // Handle the case where pop-ups are blocked
          alert('Pop-ups are blocked. Please allow pop-ups for this website to view the barcode.');
        }
      });
    },
  });
  