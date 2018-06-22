export default function MoneyValue(money) {
    var cent = false;
    if (cent) {
        return (money / 100).toFixed(2);
    }
    return (money * 1.00).toFixed(2);
}