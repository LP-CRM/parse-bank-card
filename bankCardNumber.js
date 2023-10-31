const banksData = require("./lib/bin.json")
const bunkCardValidators = require("./lib/luhn")

const incorrect = { name: "incorrect", typeOfPaymentSystem: "incorrect" }
const unknown = { name: "unknown", typeOfPaymentSystem: "unknown" }
const empty = { name: "empty", typeOfPaymentSystem: "empty" }

const formatBankCard = (value) => {
    if (typeof value != "string") return ""
    let valueWithoutGaps = value.replace(/\s/g, "")
    valueWithoutGaps = valueWithoutGaps.replace(/[^0-9\s]/g, "")

    // if (valueWithoutGaps.length > 16)
    //     valueWithoutGaps = valueWithoutGaps.slice(0, 16)

    let valueWithGaps = ""
    let spacePositions = [4, 8, 12]

    for (let i = 0; i < valueWithoutGaps.length; i++) {
        if (spacePositions.includes(i)) {
            valueWithGaps += ` ${valueWithoutGaps[i]}`
        } else {
            valueWithGaps += valueWithoutGaps[i]
        }
    }
    return valueWithGaps
}

const getBankData = (value) => {
    if (typeof value !== "string") return incorrect
    const cardNumberWithoutGaps = value.replace(/\s/g, "")
    const clearedCardNumber = cardNumberWithoutGaps.replace(/[^0-9\s]/g, "")
    if (clearedCardNumber.length === 0) return empty
    if (
        cardNumberWithoutGaps.length !== clearedCardNumber.length ||
        clearedCardNumber.length !== 16
    )
        return incorrect
    if (!bunkCardValidators(clearedCardNumber)) return incorrect

    const currentBin = clearedCardNumber.slice(0, 6)
    const foundBank = banksData.banks.find((bank) =>
        bank.bin.includes(currentBin)
    )
    if (!foundBank) return unknown

    let typeOfPaymentSystem = "unknown"

    switch (clearedCardNumber.slice(0, 1)) {
        case "5":
            typeOfPaymentSystem = "MasterCard"
            break
        case "4":
            typeOfPaymentSystem = "Visa"
            break
        case "9":
            typeOfPaymentSystem = "Простір"
            break
        default:
            typeOfPaymentSystem = "unknown"
    }

    return { name: foundBank.name, typeOfPaymentSystem }
}

exports.getBankData = getBankData
exports.formatBankCard = formatBankCard
