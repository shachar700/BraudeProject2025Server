
handleQRMessage = (msg) =>{
    console.log(`QR msg: ${msg}`);
}

handleIMUMessage = (msg) =>{
    console.log(`IMU msg: ${msg}`);
}

module.exports = {handleQRMessage, handleIMUMessage}