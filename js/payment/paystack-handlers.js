// ── PAYSTACK PAYMENT PROCESSING ──
function processPaystackPayment(data) {
  const paymentRef = 'VDR-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  
  const handler = PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: data.buyerPhone + '@vender.local',
    amount: data.totalAmount * 100, // Convert to kobo
    ref: paymentRef,
    currency: 'NGN',
    label: 'Vender: ' + orderData.name,
    onClose: function() {
      isProcessingPayment = false;
      data.btn.disabled = false;
      data.btn.textContent = 'Pay Now';
      data.btn.style.opacity = '1';
      alert('Payment cancelled. Try again.');
    },
    onSuccess: function(response) {
      if (response.status === 'success' || response.reference) {
        // Payment confirmed - hold in escrow
        orderManager.confirmPayment(data.orderId);
        
        sessionStorage.setItem('vender_order_id', data.orderId);
        setTimeout(() => {
          window.location.href = 'order-tracking.html?order=' + data.orderId;
        }, 1000);
      }
    }
  });
  
  handler.openIframe();
}

// ── BANK TRANSFER MODAL ──
function showBankTransferModal() {
  const deliveryFee = deliveryMode === 'me' ? DELIVERY_FEE : 0;
  const total = orderData.price + deliveryFee;
  
  const modal = document.createElement('div');
  modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 9999;';
  modal.innerHTML = `
    <div style="background: white; border-radius: 16px; padding: 24px; max-width: 400px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
      <h3 style="margin: 0 0 16px 0; color: #0D1F17; font-size: 18px;">Bank Transfer</h3>
      <p style="margin: 0 0 20px 0; color: #666; font-size: 14px;">Transfer ₦${fmt(total)} to Vender Escrow. Include reference code in description.</p>
      <div style="background: #F7FAF8; border: 1px solid #E4EDE8; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
        <div style="margin-bottom: 12px;">
          <div style="font-size: 11px; color: #999; text-transform: uppercase; margin-bottom: 4px;">Bank</div>
          <div style="font-weight: 600; color: #0D1F17;">Guaranty Trust Bank</div>
        </div>
        <div style="margin-bottom: 12px;">
          <div style="font-size: 11px; color: #999; text-transform: uppercase; margin-bottom: 4px;">Account</div>
          <div style="font-weight: 600; font-family: monospace; font-size: 16px; color: #1D9E75;">0123456789</div>
        </div>
        <div>
          <div style="font-size: 11px; color: #999; text-transform: uppercase; margin-bottom: 4px;">Reference</div>
          <div style="font-weight: 600; font-size: 13px; letter-spacing: 0.5px;">VDR-${Date.now()}</div>
        </div>
      </div>
      <button onclick="this.closest('div[style*=\\'position: fixed\\']').remove()" style="width: 100%; padding: 12px; background: #1D9E75; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">Confirm - I've Sent Payment</button>
    </div>
  `;
  document.body.appendChild(modal);
}
