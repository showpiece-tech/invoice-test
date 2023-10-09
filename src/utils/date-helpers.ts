// export function formatDate(d: Date): string {
//     d=new Date(d)
//     const options: Intl.DateTimeFormatOptions = {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//     };
  
//     return d.toLocaleDateString(undefined, options).replace(/\//g, '-');
    
// }
export function formatDate(date: Date): string {
  date=new Date(date)
  const day: string = String(date.getDate()).padStart(2, '0');
  const month: string = String(date.getMonth() + 1).padStart(2, '0');
  const year: number = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export function formatPrice(priceInCents: number | undefined): string {
  if (typeof (priceInCents) == 'undefined'){
    return "$0.00";
  }
  const price:number = priceInCents/100;
  price.toFixed(2);
  return '$' + price.toFixed(2);
}