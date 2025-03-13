// 駅データのリスト
const stationList = [
    { id: "JB-01", name: "三鷹" },
    { id: "JB-02", name: "吉祥寺" },
    { id: "JB-03", name: "西荻窪" },
    { id: "JB-04", name: "荻窪" },
    { id: "JB-05", name: "阿佐ケ谷" },
    { id: "JB-06", name: "高円寺" },
    { id: "JB-07", name: "中野" },
    { id: "JB-08", name: "東中野" },
    { id: "JB-09", name: "大久保" },
    { id: "JB-10", name: "新宿" },
    { id: "JB-11", name: "代々木" },
    { id: "JB-12", name: "千駄ケ谷" },
    { id: "JB-13", name: "信濃町" },
    { id: "JB-14", name: "四ツ谷" },
    { id: "JB-15", name: "市ケ谷" },
    { id: "JB-16", name: "飯田橋" },
    { id: "JB-17", name: "水道橋" },
    { id: "JB-18", name: "御茶ノ水" },
    { id: "JB-19", name: "秋葉原" },
    { id: "JB-20", name: "浅草橋" },
    { id: "JB-21", name: "両国" },
    { id: "JB-22", name: "錦糸町" },
    { id: "JB-23", name: "亀戸" },
    { id: "JB-24", name: "平井" },
    { id: "JB-25", name: "新小岩" },
    { id: "JB-26", name: "小岩" },
    { id: "JB-27", name: "市川" },
    { id: "JB-28", name: "本八幡" },
    { id: "JB-29", name: "下総中山" },
    { id: "JB-30", name: "西船橋" },
    { id: "JB-31", name: "船橋" },
    { id: "JB-32", name: "東船橋" },
    { id: "JB-33", name: "津田沼" },
    { id: "JB-34", name: "幕張本郷" },
    { id: "JB-35", name: "幕張" },
    { id: "JB-36", name: "新検見川" },
    { id: "JB-37", name: "稲毛" },
    { id: "JB-38", name: "西千葉" },
    { id: "JB-39", name: "千葉" }
];

// ゲーム状態の管理
let currentQuestionIndex = 0;
let score = 0;
let quizQuestions = [];
const totalQuestions = 10;

// DOM要素
const titleScreen = document.getElementById('title-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const currentQuestionElement = document.getElementById('current-question');
const scoreElement = document.getElementById('score');
const stationImageElement = document.getElementById('station-image');
const optionButtons = document.querySelectorAll('.option-btn');
const feedbackElement = document.getElementById('result-feedback');
const feedbackTextElement = document.getElementById('feedback-text');
const finalScoreElement = document.getElementById('final-score');
const resultMessageElement = document.getElementById('result-message');

// 画面の切り替え
function showScreen(screen) {
    // すべての画面を非表示
    titleScreen.classList.add('hidden');
    quizScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    
    // 指定した画面を表示
    screen.classList.remove('hidden');
}

// ランダムな数値の生成（min以上max未満）
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// 配列のシャッフル
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// クイズの問題を生成
function generateQuizQuestions() {
    // 駅リストのインデックスをランダムにシャッフル
    const shuffledIndices = [...Array(stationList.length).keys()];
    shuffleArray(shuffledIndices);
    
    // 最初の10問を選択
    quizQuestions = shuffledIndices.slice(0, totalQuestions).map(index => {
        const correctStation = stationList[index];
        
        // 選択肢を生成（正解を含む4つ）
        let optionIndices = [index]; // 正解の駅のインデックス
        
        // 他の3つの選択肢をランダムに選ぶ
        while (optionIndices.length < 4) {
            const randomIndex = getRandomInt(0, stationList.length);
            if (!optionIndices.includes(randomIndex)) {
                optionIndices.push(randomIndex);
            }
        }
        
        // 選択肢をシャッフル
        shuffleArray(optionIndices);
        
        return {
            stationId: correctStation.id,
            correctAnswer: correctStation.name,
            options: optionIndices.map(i => stationList[i].name),
            correctIndex: optionIndices.indexOf(index)
        };
    });
}

// 現在の問題を表示
function displayCurrentQuestion() {
    const question = quizQuestions[currentQuestionIndex];
    
    // 問題番号と得点を更新
    currentQuestionElement.textContent = currentQuestionIndex + 1;
    scoreElement.textContent = score;
    
    // 駅番号の画像を表示
    stationImageElement.src = `images/${question.stationId}.png`;
    
    // 選択肢を設定
    optionButtons.forEach((button, index) => {
        button.textContent = question.options[index];
        button.classList.remove('correct', 'incorrect');
        button.disabled = false;
    });
    
    // フィードバック領域を非表示に
    feedbackElement.classList.add('hidden');
}

// 紙吹雪エフェクトを作成
function createConfetti() {
    const confettiCount = 100;
    const colors = ['#ffcc00', '#ffdd33', '#ffe066', '#fff9cc', '#ffffff'];
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = -10 + 'px';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.opacity = Math.random() + 0.5;
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        document.body.appendChild(confetti);
        
        // アニメーション
        const animation = confetti.animate(
            [
                { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
                { transform: `translate(${Math.random() * 100 - 50}px, ${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ],
            {
                duration: Math.random() * 3000 + 2000,
                easing: 'cubic-bezier(0, .9, .57, 1)'
            }
        );
        
        animation.onfinish = () => confetti.remove();
    }
}

// 正解・不正解のエフェクトを表示
function showAnswerEffect(isCorrect) {
    if (isCorrect) {
        // 正解エフェクト
        createConfetti();
        
        // 正解の効果音を再生
        const correctSound = new Audio('sounds/seikai.mp3');
        correctSound.play();
    } else {
        // 不正解エフェクト
        document.body.classList.add('shake');
        setTimeout(() => {
            document.body.classList.remove('shake');
        }, 500);
        
        // 不正解の効果音を再生
        const incorrectSound = new Audio('sounds/fuseikai.mp3');
        incorrectSound.play();
    }
}

// 回答を処理
function handleAnswer(selectedIndex) {
    const question = quizQuestions[currentQuestionIndex];
    const isCorrect = selectedIndex === question.correctIndex;
    
    // ボタンの色を変更
    optionButtons.forEach((button, index) => {
        button.disabled = true;
        if (index === question.correctIndex) {
            button.classList.add('correct');
        } else if (index === selectedIndex && !isCorrect) {
            button.classList.add('incorrect');
        }
    });
    
    // スコア加算
    if (isCorrect) {
        score++;
        scoreElement.textContent = score;
    }
    
    // フィードバック表示
    feedbackElement.classList.remove('hidden');
    
    if (isCorrect) {
        const praises = [
            `大正解！「${question.correctAnswer}」駅です！🎉`,
            `さすが！「${question.correctAnswer}」駅が正解です！✨`,
            `素晴らしい！「${question.correctAnswer}」駅です！👍`,
            `完璧！「${question.correctAnswer}」駅ですね！🌟`
        ];
        feedbackTextElement.textContent = praises[Math.floor(Math.random() * praises.length)];
        feedbackElement.style.backgroundColor = 'rgba(76, 175, 80, 0.9)';
        feedbackElement.style.color = 'white';
    } else {
        const encouragements = [
            `残念！正解は「${question.correctAnswer}」駅です。次は当てよう！`,
            `惜しい！正解は「${question.correctAnswer}」駅でした。次頑張って！`,
            `ざんねん！正解は「${question.correctAnswer}」駅です。次回に期待！`,
            `おしい！正解は「${question.correctAnswer}」駅でした。次問に挑戦！`
        ];
        feedbackTextElement.textContent = encouragements[Math.floor(Math.random() * encouragements.length)];
        feedbackElement.style.backgroundColor = 'rgba(244, 67, 54, 0.9)';
        feedbackElement.style.color = 'white';
    }
    
    // エフェクト表示
    showAnswerEffect(isCorrect);
    
    // 次の問題へ進むか結果画面を表示
    setTimeout(() => {
        currentQuestionIndex++;
        
        if (currentQuestionIndex < totalQuestions) {
            displayCurrentQuestion();
        } else {
            showResults();
        }
    }, 2000);
}

// 結果画面を表示
function showResults() {
    finalScoreElement.textContent = score;
    
    // 得点に応じたメッセージを表示
    let message = '';
    if (score === totalQuestions) {
        message = '完璧！あなたは総武線マスターです！🏆✨';
        // 大量の紙吹雪エフェクト
        createConfetti();
        setTimeout(createConfetti, 500);
    } else if (score >= totalQuestions * 0.8) {
        message = 'すごい！あなたは総武線のエキスパートです！🥇';
        createConfetti();
    } else if (score >= totalQuestions * 0.6) {
        message = 'なかなかの知識です！総武線通ですね！👍';
    } else if (score >= totalQuestions * 0.4) {
        message = 'まずまずの成績です。もう少し総武線を利用しましょう！😊';
    } else if (score >= totalQuestions * 0.2) {
        message = '総武線の駅をもっと覚えましょう！もう一度挑戦してみては？🌟';
    } else {
        message = '総武線の旅に出かけて、駅をもっと知りましょう！次は頑張って！✨';
    }
    
    resultMessageElement.textContent = message;
    showScreen(resultScreen);
}

// イベントリスナーの設定
startButton.addEventListener('click', () => {
    // クイズを初期化
    currentQuestionIndex = 0;
    score = 0;
    generateQuizQuestions();
    displayCurrentQuestion();
    showScreen(quizScreen);
});

restartButton.addEventListener('click', () => {
    showScreen(titleScreen);
});

optionButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        handleAnswer(index);
    });
});

// 初期表示はタイトル画面
showScreen(titleScreen);
