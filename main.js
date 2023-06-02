/** @format */

$(document).ready(function () {
  const cardContainer = $(".status-result");
  const submitForm = $("#submit-form");
  const submitText = $("#submit-text");
  const submitSpinner = $("#submit-spinner");

  // 모달 닫기 이벤트 핸들러 설정
  function setupModalCloseHandlers() {
    $("#myModal").click(function (event) {
      if ($(event.target).hasClass("modal")) {
        closeModal();
      }
    });
    $(".modal-content .close").click(closeModal);
  }

  // 모달 닫기 함수
  function closeModal() {
    $("#code").val("");
    $("#phone").val("");
    $("#price").val("");
    $("#email").val("");
  }

  // 데이터 페치 함수
  let currentPrice;
  const fetchSpreadSheet = (currentPrice) => {
    $.ajax({
      url: "https://script.google.com/macros/s/AKfycbzpxWkTBfZWqJp9NHOA2hkRfyAS4Rati-YSBDKWBzSkYS6wuTZimWjxr95WnOJvxzNu/exec",
      success: (data) => {
        if (data.length === 0) {
          cardContainer.html(
            '<div class="loading-text text-center">데이터가 없습니다.</div>'
          );
          return;
        }

        // currentPrice를 기준으로 데이터 배열을 재정렬
        data.sort(
          (a, b) =>
            Math.abs(a.price - currentPrice) - Math.abs(b.price - currentPrice)
        );

        cardContainer.empty();
        const container = $(".status-result");
        data.map((result, index) => {
          const phone = String(result.phone); // 문자열로 변환
          const card = `
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-md-3 event-rank">
                <div class="card-badge" style="background: ${
                  index < 3
                    ? "linear-gradient(144deg, rgba(243,72,72,0.5382746848739496) 0%, rgba(243,72,72,1) 60%)"
                    : "transparent"
                }; color: ${index < 3 ? "white" : "black"}">${
            index < 3 ? "🏅" : ""
          } Rank ${index + 1}</div>
              </div>
              <div class="col-md-5 event-price">
                <p class="card-text" id="result-rank">
                ₩ ${addCommas(result.price)}</p>
                <p class="card-text card-text-sub" id="result-rank">
                  (${
                    result.price > currentPrice
                      ? `<i class="fas fa-caret-up"></i>`
                      : `<i class="fas fa-caret-down"></i>`
                  }${"  "}${addCommas(
            Math.abs(result.price - currentPrice)
          )})</p>
              </div>
              <div class="col-md-4 event-phone">
                <p class="card-text" id="result-rank">${
                  phone.slice(-4) || phone
                }</p>
              </div>
            </div>
          </div>
        </div>`;

          container.append(card);
        });
      },
      error: () => {
        alert("데이터를 불러올 수 없습니다. 잠시 후에 다시 시도해주세요.");
      },
      method: "GET",
      data: { function: "doGet" }
    });
  };

  const fetchCurrentPrice = () => {
    $.ajax({
      url: "https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=KRW&e=Upbit",
      method: "GET",
      success: (data) => {
        const container = $(".intro-desc2-price");
        currentPrice = data["BTC"]["KRW"];
        container.html(`<span>Now: ₩ ${addCommas(currentPrice)}</span>`);
        $("#price").attr(
          "placeholder",
          `Current Price: ₩ ${addCommas(currentPrice)}`
        );
        fetchSpreadSheet(currentPrice);
      },
      error: () => {
        alert("데이터를 불러올 수 없습니다. 잠시 후에 다시 시도해주세요.");
      }
    });
  };

  function fetchData() {
    fetchCurrentPrice();
    setInterval(fetchCurrentPrice, 10000);
  }

  // 로딩 텍스트 표시 함수
  function showLoadingText() {
    const loadingText =
      '<div class="loading-text text-center"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
    cardContainer.html(loadingText);
  }

  // 콤마 입력 합수
  function addCommas(number) {
    const parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  // 입력 제한 이벤트 핸들러 설정
  function setupInputHandlers() {
    $("#price").on("input", function () {
      const value = $(this).val();
      if (value.length > 9) {
        $(this).val(value.slice(0, 9));
      }
    });
    $("#phone").on("input", function () {
      const value = $(this).val();
      if (value.length > 11) {
        $(this).val(value.slice(0, 11));
      }
    });
  }

  setupModalCloseHandlers();
  fetchData();
  showLoadingText();
  setupInputHandlers();

  // form 제출 이벤트 설정
  function setupFormSubmitHandler() {
    $("form").submit(function (event) {
      event.preventDefault();

      submitForm.prop("disabled", true);
      submitText.css("display", "none");
      submitSpinner.css("display", "block");

      $.ajax({
        url: "https://script.google.com/macros/s/AKfycbzpxWkTBfZWqJp9NHOA2hkRfyAS4Rati-YSBDKWBzSkYS6wuTZimWjxr95WnOJvxzNu/exec",
        method: "POST",
        data: $("form").serialize(),
        success: (data) => {
          submitSpinner.css("display", "none");
          submitText.css("display", "inline");
          submitText.text("참여 완료!");
          location.reload();
        }
      });
    });
  }

  // 새로 고침 버튼 이벤트 설정
  function setupRefreshHandler() {
    $(".status-header-refresh").click(function () {
      location.reload();
    });
  }

  // 아코디언 핸들러 설정
  function setupAccordionHandlers() {
    const accordionItems = $(".accordion-item");

    accordionItems.each(function () {
      const header = $(this).find(".accordion-header");
      const content = $(this).find(".accordion-content");
      const arrowIcon = $(this).find("i");

      const handleClick = () => {
        content.toggleClass("active");
        arrowIcon.toggleClass("fa-chevron-down fa-chevron-up");

        accordionItems.each(function (index, otherItem) {
          if (!$(otherItem).is($(this))) {
            const otherContent = $(otherItem).find(".accordion-content");
            const otherArrowIcon = $(otherItem).find("i");
            otherContent.removeClass("active");
            otherArrowIcon
              .removeClass("fa-chevron-up")
              .addClass("fa-chevron-down");
          }
        });
      };

      header.on("click", handleClick);
    });
  }

  setupFormSubmitHandler();
  setupRefreshHandler();
  setupAccordionHandlers();
});
