const ZXing = require("@zxing/library");
const { verifyJWS, decodeJWS, getScannedJWS } = require("./shc");
const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function setResult(result) {
  data_scan_0 = result[0];
  data_scan_1 = result[1];
  data_scan_2 = result[2];

  console.log(data_scan_0);
  console.log(data_scan_1);
  console.log(data_scan_2);

  family_name = data_scan_0["resource"]['name'][0]['family'];
  given_name = data_scan_0["resource"]['name'][0]['given'][0];
  birthdate = data_scan_0["resource"]['birthDate'];

  immunization_data_1_status = data_scan_1["resource"]['status'];
  immunization_data_1_date = data_scan_1["resource"]['occurrenceDateTime'];
  immunization_data_1_actor = data_scan_1["resource"]['performer'][0]['actor']['display'];

  immunization_data_2_status = data_scan_2["resource"]['status'];
  immunization_data_2_date = data_scan_2["resource"]['occurrenceDateTime'];
  immunization_data_2_actor = data_scan_2["resource"]['performer'][0]['actor']['display'];

  $(".identity-data").html('<b>Full Name:</b> ' + given_name + ' ' + family_name + '<br/><b>Birth Date:</b> ' + birthdate);
  $(".immunization-data-1").html('<b>Status:</b> ' + capitalize(immunization_data_1_status) + '<br/><b>Injection Date:</b> ' + immunization_data_1_date + '<br/><b>Injection Location:</b> ' + immunization_data_1_actor);
  $(".immunization-data-2").html('<b>Status:</b> ' + capitalize(immunization_data_2_status) + '<br/><b>Injection Date:</b> ' + immunization_data_2_date + '<br/><b>Injection Location:</b> ' + immunization_data_2_actor);

  $(".first-screen").hide();
  $(".second-screen").show();

  if(immunization_data_1_status == "completed") { $(".immunization-check-1-yes").show(); }
  if(immunization_data_1_status != "completed") { $(".immunization-check-1-no").show(); }

  if(immunization_data_2_status == "completed") { $(".immunization-check-2-yes").show(); }
  if(immunization_data_2_status != "completed") { $(".immunization-check-2-no").show(); }

}

function decodeOnce(codeReader, selectedDeviceId) {
    codeReader.decodeFromInputVideoDevice(selectedDeviceId, "video").then(
        (result) => {
            const scannedJWS = getScannedJWS(result.text);
            result = decodeJWS(scannedJWS);
            result.then((decoded) =>
                {
                    setResult(decoded);
                }, e => {
                    console.error(e);
                    setResult("[]");
                }
            );
        },
        (err) => {
            setResult("[]");
        }
    );
}

let selectedDeviceId;
const codeReader = new ZXing.BrowserQRCodeReader();

codeReader
  .getVideoInputDevices()
  .then((videoInputDevices) => {
    const sourceSelect = document.getElementById("sourceSelect");
    selectedDeviceId = videoInputDevices[0].deviceId;
    if (videoInputDevices.length >= 1) {
      videoInputDevices.forEach((element) => {
        const sourceOption = document.createElement("option");
        sourceOption.text = element.label;
        sourceOption.value = element.deviceId;
        sourceSelect.appendChild(sourceOption);
      });

      sourceSelect.onchange = () => {
        selectedDeviceId = sourceSelect.value;
      };

      const sourceSelectPanel = document.getElementById("sourceSelectPanel");
      sourceSelectPanel.style.display = "block";
    }
  })
  .catch((err) => {
    console.error(err);
  });


$( document ).ready(function() {
    console.log("ready!");

    $(".startButton").on( "click", function() {
      $(".message-text-top").text("Please scan the QR Code.");
      $("#video").show();
      $(".first-screen").show();
      $(".second-screen").hide();
      decodeOnce(codeReader, selectedDeviceId);
    });

    $(".resetButton").on( "click", function() {
      $(".message-text-top").text("Please scan the QR Code.");
      $("#video").show();
      $(".first-screen").show();
      $(".second-screen").hide();
      decodeOnce(codeReader, selectedDeviceId);
    });

});