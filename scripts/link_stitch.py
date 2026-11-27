import os

base = os.path.join('frontend', 'public', 'stitch')

nav_script = """
<script>
(function() {
  function goTo(screenName) {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'NAVIGATE', screen: screenName }, '*');
    } else {
      window.location.href = '../' + screenName + '/code.html';
    }
  }
  window.navigateToScreen = goTo;

  function bindEvents() {
    // Intercept Bottom Navigation
    document.querySelectorAll('nav a, a[data-path]').forEach(function(el) {
      el.style.cursor = 'pointer';
      el.addEventListener('click', function(e) {
        var p = el.getAttribute('data-path') || el.innerText.trim().toLowerCase();
        if (p.includes('pos') || p === 'pos-sales') { e.preventDefault(); goTo('pos_sale_quick_invoice'); }
        else if (p.includes('udhar') || p.includes('credit') || p === 'credit-udhar') { e.preventDefault(); goTo('customer_udhar_whatsapp_follow_up'); }
        else if (p.includes('inventory') || p.includes('stock')) { e.preventDefault(); goTo('inventory_supplier_reorder'); }
        else if (p.includes('dash') || p === 'dashboard') { e.preventDefault(); goTo('retail_kirana_dashboard'); }
        else if (p.includes('more') || p.includes('report') || p.includes('gst')) { e.preventDefault(); goTo('ca_audit_gst_monthly_report'); }
      });
    });

    // Intercept action buttons
    document.querySelectorAll('button, a').forEach(function(btn) {
      var txt = (btn.innerText || '').trim();
      var id = btn.id || '';
      if (txt.includes('New POS Sale') || txt.includes('+ New POS')) {
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', function(e) { e.preventDefault(); goTo('pos_sale_quick_invoice'); });
      } else if (txt.includes('Record Udhar') || id === 'newUdharBtn') {
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', function(e) { e.preventDefault(); goTo('customer_udhar_whatsapp_follow_up'); });
      } else if (txt.includes('Stock In') || txt.includes('+ Inward Stock') || txt.includes('Inward Stock')) {
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', function(e) { e.preventDefault(); goTo('inward_stock_grn_verification'); });
      } else if (txt.includes('Cash Flow') || txt.includes('Runway') || id === 'refresh-btn' || txt.includes('Safe Runway')) {
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', function(e) { e.preventDefault(); goTo('cash_flow_forecast_simulator'); });
      } else if (id === 'continue-btn') {
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          if (window.location.href.includes('business_selection')) goTo('onboarding_wizard');
          else goTo('retail_kirana_dashboard');
        });
      } else if (txt.includes('Draft PO') || txt.includes('Verify GRN')) {
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', function(e) { e.preventDefault(); goTo('cash_flow_forecast_post_grn'); });
      } else if (txt.includes('Sharma General Kirana')) {
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', function(e) { e.preventDefault(); goTo('business_selection_light'); });
      }
    });

    // Back buttons
    document.querySelectorAll('button[aria-label="Go back"], button[onclick*="history.back"], a[href="#"]:has(span:contains("arrow_back"))').forEach(function(el) {
      el.style.cursor = 'pointer';
      el.addEventListener('click', function(e) {
        e.preventDefault();
        goTo('retail_kirana_dashboard');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindEvents);
  } else {
    bindEvents();
  }
})();
</script>
"""

count = 0
for d in os.listdir(base):
    path = os.path.join(base, d, 'code.html')
    if os.path.isfile(path):
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        if 'window.navigateToScreen' not in content:
            content = content.replace('</body>', nav_script + '\n</body>')
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
            count += 1
            print(f"Injected navigation into: {d}")

print(f"Successfully updated {count} Stitch screen files.")
