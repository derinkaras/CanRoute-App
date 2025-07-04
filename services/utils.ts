export const getWeekOf = (date: Date) => {
    const copy = new Date(date); // avoid mutating original
    const day = copy.getDay(); // 0 (Sun) to 6 (Sat)

    // Calculate difference to Monday
    const diff = copy.getDate() - (day === 0 ? 6 : day - 1); // if Sunday, go back 6 days
    const monday = new Date(copy.setDate(diff));

    // Zero out time
    monday.setHours(0, 0, 0, 0);

    return monday;
};


export const getStatusColor = (status: string) => {
    switch (status) {
        case 'serviced': return 'bg-green-600';
        case 'not_needed': return 'bg-orange-500';
        case 'unserviced':
        default: return 'bg-red-500';
    }
};
