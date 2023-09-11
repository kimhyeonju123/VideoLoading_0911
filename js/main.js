const frame = document.querySelector("main");
const mask = document.querySelector(".mask");

const imgs = ["pic1.jpg", "pic2.jpg", "pic3.jpg", "pic4.jpg"];
const vids = ["vid1.mp4", "vid2.mp4", "vid3.mp4", "vid4.mp4", "vid5.mp4"];

let tags = "";
// 여기다가 하나하나 담을 거임

imgs.map((el) => {
    tags += `
    <img src="vids/${el}">
    `
})
vids.map((el) => {
    tags += `
    <video src="vids/${el}" loop muted autoplay></video>
    `

})
frame.innerHTML = tags;
endLoading();
console.log(tags);

// 이미지를 로딩해서 로딩에 성공하면 프로미스가 resolve를 반환하는 함수
function loadingImg() {
    return new Promise((res, rej) => {
        let countImg = 0;
        const imgDOM = frame.querySelectorAll("img");

        // 여기 내용을 안 쓰면
        // 무한루프가 발생할 수 있음

        // 이미지 값이 어떤 상황에서든지 0이 될 때
        // 아래의 imgDOM.forEach((el, index) => { 이 구문으로 시작한다면
        // imgDOM이 없는 상태에서 if문을 만나게 됨
        // 이 경우 if문에 else를 적용하지 않아서 해당 구문 안에서 무한대기 상태가 됨 == 무한루프
        // 따라서 이미지의 값이 0이 되는 경우에는 res(true)를
        // 반환하여 빈값의 이미지라도 구현되도록 하는 코드입니다
        if (imgDOM.length == 0) {
        // 예외처리 부분
        // 단순)) 무한루프를 방지하기 위한 예외처리
            return res(true);
            // 여기에 트루를 적은 이유
        }

        imgDOM.forEach((el) => {
            el.addEventListener("load", () => {
                countImg++;
                // 로드가 됐으면 카운트하셈
                if (countImg === imgs.length) res(true);
            })
            el.addEventListener("error", () => {
                rej(new Error("이미지가 중간에 손상되었ㅅ브니다"));
            })
        });
    })
}
// 비디오를 로딩해서 플레이가 가능할 정도의 데이터 로딩이 되었다면 프로미스가 resolve를 반환하는 함수
function loadingVid() {
    return new Promise((res, rej) => {
        let countVid = 0;
        const vidDOM = frame.querySelectorAll("video");

        // 0일 때를 대비한 예외처리
        if (vidDOM.length === 0) {
            return res(true);
        }

        vidDOM.forEach((el, index) => {
            // loadeddata 이벤트는 비디오, 오디오 등의 콘텐츠가 로드되는 것에 대한 이벤트임
            // load와는 다름, 즉 미디어 데이터가 최초로 로드되어 재생할 준비가 되었을 때
            // 발생하는 이벤트
            el.addEventListener("loadeddata", () => {
                countVid++;
                if (countVid === vids.length) res(true);
            })
            el.addEventListener("error", () => {
                rej(new Error("비디오가 중간에 손상"));
            })
        })
    })
}

// 위 2개의 함수에서는 프로미스로 resolve를 반환하고
// 엔드함스에서 이 두 리졸브를 가지고
// 소스캐싱(비디,이미..) - 모두 로딩이 된것으로 판단하고 마스크 화면을 제거하는 함수
// async 키워드 : 함수 앞에 사용되며 함수가 비동기적으로 작동하도록 합니다
// 따라서 위 두 함수의 값이 전달되기 전까지는 함수가 작동되지 않습니다 
async function endLoading() {
    try {
// await 키워드는 async 함수 내부에서만 사용이 가능하다
// 또한 프로미스의 완료를 기다리는데 사용된다. 따라서 js는 await키워드를 만나면
// 프로미스가 완료될 때까지의 함수 실행을 일시 중지하지만, 외부코드는 실행하며
// 프로미스 완료 시 함수 실행을 재개한다
        const [loadImg, loadVid] = await Promise.all([loadingImg(), loadingVid()]);
// Promise.all([])
// : 프로미스를 병렬로 실행하고, 완료된 값을 배열로 입력받아서 
// 성공적으로 모든 프로미스가 리졸브를 반환하면 (모두 성공했다는 뜻).. 새로운 프로미스 객체로 반환함
// 그러나 하나라도 리젝트(실패)가 반환되면 Promise.all또한 실패한 것으로 되어 첫번째로 리젝트가 된 값
// 즉 첫번째 오류를 반환합니다
        // console.log(loadingImg, loadingVid);


        // 만약에 여기가 모두 헬로로 들어오면 문자열이 존재하는지로 따져서
        if(loadImg && loadVid){
            mask.computedStyleMap.opacity = "0";
            setTimeout(() => {
                mask.remove();
            }, 1000);
        }
    } catch (error) {
        console.log("에러에러에러ㅔ러ㅔ러에러엘ㅇ레ㅔㅓㄹ");
    }finally{
        // 
        console.log("무조건 발생 : 이 함수고 실행되는지 여부 확인")
    }
}
