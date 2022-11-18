(function calculateMD5Hash(file, bufferSize) {
    let def = Q.defer();

    let fileReader = new FileReader();
    let fileSlicer = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
    let hashAlgorithm = new SparkMD5();
    let totalParts = Math.ceil(file.size / bufferSize);
    let currentPart = 0;
    let startTime = new Date().getTime();

    fileReader.onload = function (e) {
        currentPart += 1;

        def.notify({
            currentPart: currentPart,
            totalParts: totalParts
        });

        let buffer = e.target.result;
        hashAlgorithm.appendBinary(buffer);

        if (currentPart < totalParts) {
            processNextPart();
            return;
        }

        def.resolve({
            hashResult: hashAlgorithm.end(),
            duration: new Date().getTime() - startTime
        });
    };

    fileReader.onerror = function (e) {
        def.reject(e);
    };

    function processNextPart() {
        let start = currentPart * bufferSize;
        let end = Math.min(start + bufferSize, file.size);
        fileReader.readAsBinaryString(fileSlicer.call(file, start, end));
    }

    processNextPart();
    return def.promise;
    }

    function calculate() {

    let input = document.getElementById('file');
    if (!input.files.length) {
        return;
    }

    let file = input.files[0];
    let bufferSize = Math.pow(1024, 2) * 10; // 10MB

    calculateMD5Hash(file, bufferSize).then(
        function (result) {
            // Success
            console.log(result);
            // SEND result TO THE SERVER
        },
        function (err) {
            // There was an error,
        });
    });
