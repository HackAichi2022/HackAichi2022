function checkname() {
    const Pname = document.getElementById("Pname");
    const button = document.getElementById("button");
    if(Pname.value && Pname.value.length) {
      // 入力欄が空👉disabled解除
      button.disabled = false;
    } else {
      // 入力されている👉disabledを付与
      button.disabled = true;
    }
  }