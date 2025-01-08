export const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

export function isFromYesterday(formattedDate) {
    const [day, month, year] = formattedDate.split('/').map(Number);
    
    const newsDate = new Date(year, month - 1, day); // Month is zero-indexed in JS Date
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // Go back 1 day
    yesterday.setHours(0, 0, 0, 0); // Set to start of day
  
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today
  
    return newsDate >= yesterday && newsDate < today;
  }
  