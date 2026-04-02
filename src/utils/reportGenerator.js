export const downloadCustomerReport = (user, orders, enquiries) => {
    let reportContent = `========================================================\n`;
    reportContent += `         FIVE STAR EXPORTERS - ACCOUNT REPORT\n`;
    reportContent += `========================================================\n\n`;

    reportContent += `[ USER DETAILS ]\n`;
    reportContent += `Name: ${user.name || 'Guest User'}\n`;
    reportContent += `Email: ${user.email || 'N/A'}\n`;
    reportContent += `Phone: ${user.phone || 'N/A'}\n`;
    reportContent += `Company: ${user.company || 'N/A'}\n`;
    reportContent += `Report Generated On: ${new Date().toLocaleString()}\n\n`;

    reportContent += `--------------------------------------------------------\n`;
    reportContent += `[ ORDER HISTORY (${orders.length} Orders) ]\n\n`;

    if (orders.length === 0) {
        reportContent += `No orders placed.\n`;
    } else {
        orders.forEach((order, index) => {
            reportContent += `Order #${Math.abs(index - orders.length)} | ID: ${order._id.slice(-8).toUpperCase()} | Date: ${new Date(order.createdAt).toLocaleDateString()}\n`;
            reportContent += `Status: ${order.status} | Total Amount: INR ${order.totalAmount?.toLocaleString('en-IN')}\n`;
            reportContent += `Items (${order.items?.length || 0}):\n`;
            order.items?.forEach(item => {
                reportContent += `  - ${item.productName || item.product?.name || 'Unknown Item'} (Qty: ${item.quantity || 1})\n`;
            });
            reportContent += `\n`;
        });
    }

    reportContent += `--------------------------------------------------------\n`;
    reportContent += `[ ENQUIRY HISTORY (${enquiries.length} Enquiries) ]\n\n`;

    if (enquiries.length === 0) {
        reportContent += `No enquiries submitted.\n`;
    } else {
        enquiries.forEach((enq, index) => {
            reportContent += `Enquiry #${Math.abs(index - enquiries.length)} | Subject: ${enq.subject} | Date: ${new Date(enq.createdAt).toLocaleDateString()}\n`;
            reportContent += `Status: ${enq.status}\n`;
            reportContent += `Message: "${enq.message}"\n`;
            if (enq.adminReply) {
                reportContent += `Admin Reply: "${enq.adminReply}"\n`;
            }
            reportContent += `\n`;
        });
    }

    reportContent += `========================================================\n`;
    reportContent += `             END OF REPORT\n`;
    reportContent += `========================================================\n`;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FiveStarExporters_Report_${user.name?.replace(/\s+/g, '_') || 'Guest'}.txt`;
    
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }, 100);
};
