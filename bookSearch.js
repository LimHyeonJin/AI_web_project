function call_ajax() {

    if (event.keyCode == 13) {
        // 서버쪽 프로그램을 호출해서 결과를 받아온다.
        // jQuery를 이용해 AJAX 처리를 해야한다.
        // ajax의 인자로 javascript 객체를 넣어준다.
        // javascript 객체는 => { key : value, key : value, ...}
        // data : 서버 프로그램에게 넘겨줄 데이터들...
        $("tbody").empty()
        var key = $("input[type=text]").val()
        // var key_url = encodeURI(key)
        $.ajax({
            async: true,
            url: "https://dapi.kakao.com/v3/search/book?target=title",
            type: "GET",
            timeout: 3000,
            data: {query: key, size: 50},
            dataType: "json",
            headers: {Authorization: "KakaoAK 975917afd98807b54fb0a8eb6009dbf9"},
            success: function (result) {
                $.each(result.documents, function (idx, item) {  // for문과 동일한 방식이다. 각각의 result에 대해 function을 수행
                    var tr = $("<tr></tr>")

                    var isbn = item.isbn.slice(-13)
                    var ISBNTd = $("<td></td>").text(isbn)

                    var imgTd = $("<td></td>")
                    var img = $("<img \>").attr({"src": item.thumbnail, "width": "200"})  //<img src= ~~~>
                    imgTd.append(img)

                    var titleTd = $("<td></td>").text(item.title)
                    var authorTd = $("<td></td>").text(item.authors)
                    var PbDtTd = $("<td></td>").text(item.datetime.substring(0, 10))


                    var infoTd = $("<td></td>")
                    var infoBtn = $("<input \>").attr({type: "button", value: "상세정보"})
                    infoBtn.on("click", function () {
                        // 현재 클릭된 버튼에 대한 책 정보를 찾아서 삭제.
                        // this : 현재 이벤트가 발생된 객체를 지칭.
                        infonaru(item.title, isbn)
                    }) // "(click)"할때 이벤트 처리(함수)
                    infoTd.append(infoBtn)


                    tr.append(ISBNTd)
                    tr.append(imgTd)
                    tr.append(titleTd)
                    tr.append(authorTd)
                    tr.append(PbDtTd)


                    tr.append(infoTd)

                    $("tbody").append(tr)
                })

            },
            error: function (request, status, error) {
                alert("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
                console.log(error)
            },
        })
    }
}

function infonaru(lib_name, ISBN) {
    $("tbody").empty()
    $.ajax({
        async: true, // ajax sync를 동기 방식으로 할지, 비동기 방식으로 할지  비동기 방식의 호출은 true!
        url: "http://data4library.kr/api/libSrchByBook?authKey=6933bb3911c27b1bb03b529fcf3e4789b8b2e91c9c059689910963272f861062&region=11&format=json&isbn=" + ISBN,
        type: "GET",
        timeout: 3000,
        dataType: "json",  // 결과 JSON을 JavaScript객체로 변환
        success: function (result) {   // 서버가 주는 데이터 : result

            $.each(result.response.libs, function (idx, item) {  // for문과 동일한 방식이다. 각각의 result에 대해 function을 수행
                var tr = $("<tr></tr>")

                var libcode = item.lib.libCode
                var libCodeTd = $("<td></td>").text(libcode)

                var libNameTd = $("<td></td>").text(item.lib.libName)
                var addressTd = $("<td></td>").text(item.lib.address)
                var latitude = $("<td></td>").text(item.lib.latitude)
                var longitude = $("<td></td>").text(item.lib.longitude)
                var operationTimeTd = $("<td></td>").text(item.lib.operatingTime)

                var closedTd = $("<td></td>").text(item.lib.closed)
                var homepageTd = $("<td></td>").text(item.lib.homepage)

                var rent = call_rent(libcode, ISBN)
                console.log(libcode, ISBN)
                console.log(rent)
                var rentTd = $("<td></td>").text(rent)


                var delTd = $("<td></td>")
                var delBtn = $("<input \>").attr({type: "button", value: "삭제"})
                delBtn.on("click", function () {
                    // 현재 클릭된 버튼에 대한 책 정보를 찾아서 삭제.
                    // this : 현재 이벤트가 발생된 객체를 지칭.
                    $(this).parent().parent().remove()
                }) // "(click)"할때 이벤트 처리(함수)
                delTd.append(delBtn)


                tr.append(libCodeTd)
                tr.append(libNameTd)
                tr.append(addressTd)
                tr.append(latitude)
                tr.append(longitude)
                tr.append(operationTimeTd)
                tr.append(closedTd)
                tr.append(homepageTd)
                tr.append(rentTd)

                tr.append(delTd)

                $("tbody").append(tr)
            })

        },
        error: function (request, status, error) {
            alert("code = " + request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
            console.log(error)
        },
    })
}

function call_rent(libcode, ISBN) {
    var rent_avail
    $.ajax({
        async: false, // ajax sync를 동기 방식으로 할지, 비동기 방식으로 할지  비동기 방식의 호출은 true!
        url: "http://data4library.kr/api/bookExist?authKey=6933bb3911c27b1bb03b529fcf3e4789b8b2e91c9c059689910963272f861062&format=json&libCode=" + libcode + "&isbn13=" + ISBN,
        type: "GET",
        timeout: 3000,
        dataType: "json",  // 결과 JSON을 JavaScript객체로 변환
        success: function (result) {
            rent_avail = result.response.result.loanAvailable
        },
    })
    return rent_avail
}