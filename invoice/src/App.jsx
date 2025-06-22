import React, { useState, useRef } from 'react';
import { Download } from 'lucide-react';

const InvoiceGenerator = () => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '19',
    date: '08/06/2025',
    items: [
      { description: 'F/C.', qty: 155, unitPrice: 260.00, amount: 40300.00 },
      { description: 'F/C SS', qty: 27, unitPrice: 170.00, amount: 4590.00 },
      { description: 'F/C SSS', qty: 8, unitPrice: 110.00, amount: 880.00 }
    ]
  });

  const invoiceRef = useRef(null);

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
  };

  const updateInvoiceField = (field, value) => {
    setInvoiceData(prev => ({ ...prev, [field]: value }));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...invoiceData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'qty' || field === 'unitPrice') {
      newItems[index].amount = newItems[index].qty * newItems[index].unitPrice;
    }
    
    setInvoiceData(prev => ({ ...prev, items: newItems }));
  };

  const addNewItem = () => {
    const newItem = { description: '', qty: 0, unitPrice: 0, amount: 0 };
    setInvoiceData(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const removeItem = (index) => {
    const newItems = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData(prev => ({ ...prev, items: newItems }));
  };

  const downloadAsPNG = async () => {
    if (!invoiceRef.current) return;

    try {
      // Load html2canvas from CDN
      if (!window.html2canvas) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.onload = () => {
          generateCanvas();
        };
        script.onerror = () => {
          alert('Failed to load html2canvas library. Please check your internet connection.');
        };
        document.head.appendChild(script);
      } else {
        generateCanvas();
      }

      function generateCanvas() {
        // Temporarily hide edit controls and buttons for clean download
        const inputs = invoiceRef.current.querySelectorAll('input');
        const buttons = invoiceRef.current.querySelectorAll('button');
        
        inputs.forEach(input => {
          input.style.border = 'none';
          input.style.outline = 'none';
          input.style.backgroundColor = 'transparent';
          input.readOnly = true;
        });
        
        buttons.forEach(button => {
          button.style.display = 'none';
        });

        window.html2canvas(invoiceRef.current, {
          backgroundColor: '#ffffff',
          scale: 3, // Higher scale for better quality
          useCORS: true,
          allowTaint: true,
          logging: false,
          width: 600, // Fixed width for consistency
          height: invoiceRef.current.scrollHeight,
          windowWidth: 1200, // Simulate desktop width
          windowHeight: 800
        }).then(canvas => {
          // Restore edit controls
          inputs.forEach(input => {
            input.readOnly = false;
          });
          
          buttons.forEach(button => {
            button.style.display = '';
          });

          const link = document.createElement('a');
          link.download = `invoice-${invoiceData.invoiceNumber}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        }).catch(error => {
          console.error('Error generating canvas:', error);
          alert('Error generating invoice image. Please try again.');
          
          // Restore edit controls in case of error
          inputs.forEach(input => {
            input.readOnly = false;
          });
          
          buttons.forEach(button => {
            button.style.display = '';
          });
        });
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Error downloading invoice. Please try again.');
    }
  };

  const subtotal = calculateSubtotal();

  const styles = {
    wrapper: {
      maxWidth: '800px',
      margin: '0 auto'
    },
    invoice: {
      backgroundColor: 'white',
      border: '2px solid #153d63',
      margin: '0 auto',
      width: '100%',
      maxWidth: '600px'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: '24px',
      borderBottom: '1px solid #d1d5db'
    },
    companyInfo: {
      flex: 1
    },
    companyName: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#156082',
      
      margin: 0,
      marginBottom: '29px',
    },
    companyLocation: {
      fontSize: '19px',
      fontWeight: '600',
      color: 'black',
      margin: 0
    },
    invoiceTitle: {
      fontSize: '50px',
      fontWeight: 'bold',
      color: '#156082',
      margin: 0
    },
    billInfo: {
      padding: '24px',
      borderBottom: '1px solid #d1d5db'
    },
    billInfoFlex: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    },
    billNoSection: {
      flex: 1
    },
    billNoHeader: {
      backgroundColor: '#153d63',
      color: 'white',
      padding: '8px 12px',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '18px',
      display: 'inline-block',
      minWidth: '198px',
      
    },
    billDetails: {
      fontWeight: '600',
      lineHeight: '1.4',
      margin: 0
    },
    invoiceSection: {
      textAlign: 'right'
    },
    invoiceHeader: {
      backgroundColor: '#153d63',
      color: 'white',
      padding: '8px 12px',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '18px',
      display: 'flex',
      gap: '52px',
      minWidth: '198px'
    },
    invoiceInputs: {
      display: 'flex',
      gap: '32px'
    },
    invoiceInput: {
      border: 'none',
      outline: 'none',
      backgroundColor: 'transparent',
      fontWeight: '600',
      textAlign: 'center',
      fontSize: '14px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    tableHeader: {
      backgroundColor: '#153d63',
      color: 'white'
    },
    tableHeaderCell: {
      padding: '12px',
      fontSize: '14px',
      fontWeight: '600',
      borderRight: '1px solid white',
      textAlign: 'center'
    },
    tableRow: {
      borderBottom: '1px solid #d1d5db'
    },
    tableCell: {
      padding: '12px',
      borderRight: '1px solid #d1d5db',
      textAlign: 'center'
    },
    tableCellInput: {
      width: '100%',
      border: 'none',
      outline: 'none',
      backgroundColor: 'transparent',
      textAlign: 'center',
      fontSize: '14px'
    },
    descriptionCell: {
      textAlign: 'left',
      width: '40%'
    },
    qtyCell: {
      width: '15%'
    },
    priceCell: {
      width: '20%'
    },
    amountCell: {
      width: '25%',
      borderRight: 'none'
    },
    subtotalRow: {
      backgroundColor: '#f9fafb',
      fontWeight: '600'
    },
    emptyRow: {
      height: '32px'
    },
    footer: {
      padding: '24px'
    },
    footerTop: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px'
    },
    thankYou: {
      color: '#156082',
      fontStyle: 'italic',
      margin: 0
    },
    subtotalFooter: {
      fontWeight: '600',
      gap: "77px",
      display: 'flex',
      justifyContent: 'flex-end'
    },
    totalBar: {
  backgroundColor: '#153d63',
  color: 'white',
  padding: '12px 24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '300px', // Controls bar width
  marginLeft: 'auto', // Aligns right
  borderRadius: '4px', // Optional for rounded corners
},
    totalText: {
      fontSize: '28px',
      fontWeight: 'bold'
    },
    downloadSection: {
      textAlign: 'center',
      marginTop: '32px'
    },
    downloadBtn: {
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'background-color 0.2s'
    },
    controlButtons: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'center',
      marginTop: '20px',
      marginBottom: '20px'
    },
    addBtn: {
      backgroundColor: '#10b981',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px'
    },
    removeBtn: {
      backgroundColor: '#ef4444',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '12px',
      marginLeft: '8px'
    }
  };

  // Mobile responsive styles - only for container, not the invoice itself
  const mobileStyles = `
    @media (max-width: 768px) {
      .invoice-container:not(.downloading) {
        padding: 10px !important;
      }
      
      .invoice-wrapper:not(.downloading) {
        max-width: 100% !important;
      }
      
      .control-buttons {
        flex-direction: column !important;
        align-items: center !important;
      }
    }
  `;

  return (
    <>
      <style>{mobileStyles}</style>
      <div style={styles.container} className="invoice-container">
        <div style={styles.wrapper} className="invoice-wrapper">
          {/* Control Buttons */}
          <div style={styles.controlButtons} className="control-buttons">
            <button style={styles.addBtn} onClick={addNewItem}>
              Add New Item
            </button>
          </div>

          {/* Invoice Container */}
          <div ref={invoiceRef} style={styles.invoice} className="invoice">
            {/* Header */}
            <div style={styles.header} className="header">
              <div style={styles.companyInfo}>
                <h1 style={styles.companyName} className="company-name">OMEGA INTERNATIONAL</h1>
                <p style={styles.companyLocation}>CHENNAI</p>
              </div>
              <div>
                <h2 style={styles.invoiceTitle} className="invoice-title">INVOICE</h2>
              </div>
            </div>

            {/* Bill Info */}
            <div style={styles.billInfo}>
              <div style={styles.billInfoFlex} className="bill-info-flex">
                <div style={styles.billNoSection}>
                  <div style={styles.billNoHeader}>BILL NO</div>
                  <p style={styles.billDetails}>KONDABABU<br />ANDHRA</p>
                </div>
                <div style={styles.invoiceSection} className="invoice-section">
                  <div style={styles.invoiceHeader}>
                    <span>INVOICE#</span>
                    <span>DATE</span>
                  </div>
                  <div style={styles.invoiceInputs}>
                    <input
                      type="text"
                      value={invoiceData.invoiceNumber}
                      onChange={(e) => updateInvoiceField('invoiceNumber', e.target.value)}
                      style={{...styles.invoiceInput, width: '64px'}}
                    />
                    <input
                      type="text"
                      value={invoiceData.date}
                      onChange={(e) => updateInvoiceField('date', e.target.value)}
                      style={{...styles.invoiceInput, width: '96px'}}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <table style={styles.table}>
              {/* Table Header */}
              <thead style={styles.tableHeader}>
                <tr>
                  <th style={{...styles.tableHeaderCell, ...styles.descriptionCell, textAlign: 'left'}} className="table-header-cell">DESCRIPTION</th>
                  <th style={{...styles.tableHeaderCell, ...styles.qtyCell}} className="table-header-cell">QTY</th>
                  <th style={{...styles.tableHeaderCell, ...styles.priceCell}} className="table-header-cell">UNIT PRICE</th>
                  <th style={{...styles.tableHeaderCell, ...styles.amountCell, borderRight: 'none'}} className="table-header-cell">AMOUNT</th>
                </tr>
              </thead>

              <tbody>
                {/* Table Rows */}
                {invoiceData.items.map((item, index) => (
                  <tr key={index} style={styles.tableRow}>
                    <td style={{...styles.tableCell, ...styles.descriptionCell, textAlign: 'left'}} className="table-cell">
                      <div style={{display: 'flex', alignItems: 'center'}}>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          style={{...styles.tableCellInput, textAlign: 'left'}}
                          className="table-cell-input"
                        />
                        {invoiceData.items.length > 1 && (
                          <button
                            style={styles.removeBtn}
                            onClick={() => removeItem(index)}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </td>
                    <td style={{...styles.tableCell, ...styles.qtyCell}} className="table-cell">
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) => updateItem(index, 'qty', parseFloat(e.target.value) || 0)}
                        style={styles.tableCellInput}
                        className="table-cell-input"
                      />
                    </td>
                    <td style={{...styles.tableCell, ...styles.priceCell}} className="table-cell">
                      <input
                        type="number"
                        step="0.01"
                        value={item.unitPrice.toFixed(2)}

                        onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        style={styles.tableCellInput}
                        className="table-cell-input"
                      />
                    </td>
                    <td style={{...styles.tableCell, ...styles.amountCell, borderRight: 'none'}} className="table-cell">
                      ₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}

                    </td>
                  </tr>
                ))}

                {/* Subtotal Row */}
                <tr style={{...styles.tableRow, ...styles.subtotalRow}}>
                  <td style={{...styles.tableCell, ...styles.descriptionCell, textAlign: 'left'}} className="table-cell">
                    SUBTOTAL
                  </td>
                  <td style={{...styles.tableCell, ...styles.qtyCell}} className="table-cell"></td>
                  <td style={{...styles.tableCell, ...styles.priceCell}} className="table-cell"></td>
                  <td style={{...styles.tableCell, ...styles.amountCell, borderRight: 'none'}} className="table-cell">
                    ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}

                  </td>
                </tr>

                {/* Empty Rows */}
                <tr style={{...styles.tableRow, ...styles.emptyRow}}>
                  <td style={{...styles.tableCell, ...styles.descriptionCell}} className="table-cell"></td>
                  <td style={{...styles.tableCell, ...styles.qtyCell}} className="table-cell"></td>
                  <td style={{...styles.tableCell, ...styles.priceCell}} className="table-cell"></td>
                  <td style={{...styles.tableCell, ...styles.amountCell, borderRight: 'none'}} className="table-cell"></td>
                </tr>
                <tr style={{...styles.tableRow, ...styles.emptyRow}}>
                  <td style={{...styles.tableCell, ...styles.descriptionCell}} className="table-cell"></td>
                  <td style={{...styles.tableCell, ...styles.qtyCell}} className="table-cell"></td>
                  <td style={{...styles.tableCell, ...styles.priceCell}} className="table-cell"></td>
                  <td style={{...styles.tableCell, ...styles.amountCell, borderRight: 'none'}} className="table-cell"></td>
                </tr>
              </tbody>
            </table>

            {/* Footer */}
            <div style={styles.footer}>
              <div style={styles.footerTop} className="footer-top">
                <p style={styles.thankYou}>Thank you for your business!</p>
                <div style={styles.subtotalFooter}>
                  <span>SUBTOTAL </span>
                  <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
</span>
                </div>
              </div>
              
              <div style={styles.totalBar}>
                <span style={styles.totalText} className="total-text">TOTAL</span>
                <span style={styles.totalText} className="total-text">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
</span>
              </div>
            </div>
          </div>

          {/* Download Button */}
          <div style={styles.downloadSection}>
            <button
              onClick={downloadAsPNG}
              style={styles.downloadBtn}
              onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
            >
              <Download size={20} />
              Download as PNG
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceGenerator;