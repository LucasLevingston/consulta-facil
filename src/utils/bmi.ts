export function getBmiLabel(bmi: number): string {
	if (bmi < 18.5) return "Abaixo do peso";
	if (bmi < 25) return "Normal";
	if (bmi < 30) return "Sobrepeso";
	return "Obesidade";
}
