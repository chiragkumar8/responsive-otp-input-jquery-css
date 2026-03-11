$(document).ready(function() {
  const $inputs = $('.otp-box');

  // Auto-focus first field
  $inputs.first().focus();

  // Handle typing digits
  $inputs.on('input', function() {
    const val = this.value.replace(/\D/g, ''); // only digits
    this.value = val;

    if (val.length === 1) {
      $(this).addClass('filled').removeClass('error');
      const $next = $(this).next('.otp-box');
      if ($next.length) $next.focus();
    }

    checkIfComplete();
  });

  // Handle backspace, delete, arrows
  $inputs.on('keydown', function(e) {
    const $this = $(this);
    const index = $inputs.index(this);

    if (e.key === 'Backspace' || e.key === 'Delete') {
      if (this.value === '') {
        // Move to previous if current is already empty
        if (index > 0) {
          e.preventDefault();
          const $prev = $inputs.eq(index - 1);
          $prev.focus();
          $prev.val('').removeClass('filled error');
        }
      } else {
        // Just clear current on backspace/delete (browser handles it)
        $this.removeClass('filled error');
      }
    }
    else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (index > 0) {
        $inputs.eq(index - 1).focus();
      }
    }
    else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (index < $inputs.length - 1) {
        $inputs.eq(index + 1).focus();
      }
    }
  });

  // Paste support (on any field)
  $inputs.on('paste', function(e) {
    e.preventDefault();
    const paste = (e.originalEvent || e).clipboardData.getData('text').replace(/\D/g, '');
    if (!paste) return;

    let currentIndex = $inputs.index(this);
    let chars = paste.split('').slice(0, 6 - currentIndex);

    $inputs.each(function(i) {
      if (i >= currentIndex && chars.length > 0) {
        const char = chars.shift();
        $(this).val(char).addClass('filled').removeClass('error');
      }
    });

    // Focus the next logical field after paste
    const nextFocusIndex = Math.min(currentIndex + paste.length, 5);
    $inputs.eq(nextFocusIndex).focus();

    checkIfComplete();
  });

  function checkIfComplete() {
    if ($inputs.filter((i, el) => el.value.length === 1).length === 6) {
      const code = $inputs.map((i, el) => el.value).get().join('');
      setTimeout(() => {
        alert('OTP Submitted: ' + code);
        $inputs.val('').removeClass('filled');
      }, 300);
    }
  }

  // Resend simulation
  $('#resendLink').click(function(e) {
    e.preventDefault();
    alert('Resend requested.');
    $(".code-expire").hide();
    $(".resend-box").show();
  });

  // Simple countdown demo
  let time = 5;
  const $timer = $('#timer');
  const countdown = setInterval(() => {
    time--;
    const min = Math.floor(time / 60).toString().padStart(2,'0');
    const sec = (time % 60).toString().padStart(2,'0');
    $timer.text(min + ':' + sec);
    if (time <= 0) {
      clearInterval(countdown);
      $(".code-expire").hide();
      $(".resend-box").show();
    }
  }, 1000);
});