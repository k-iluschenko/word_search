<template>
  <div class="container">
    <section>
      <div>
        <img src="@/assets/game.png" alt="example" height="200" />
        <img src="@/assets/example_2.jpg" alt="example" height="200" />
        <p>
          Предназначено для помощи в игре "угадай слово". Указываешь какой длины слово,
          какие буквы есть, а каких нет. Так же можно указать на каких местах были найдены
          буквы.
        </p>
      </div>
    </section>
    <section>
      <div class="findWords">
        <label>
          <span>Длина слова</span>
          <input v-model="length" />
        </label>
      </div>
      <div class="findWords">
        <label>
          <span>Буквы которых нет в слове</span>
          <input v-model="negativeLetters" />
        </label>
      </div>
      <div
        :style="{
          display: 'flex',
          justifyContent: 'center'
        }"
        v-for="groupLetters in letters"
        :key="groupLetters"
      >
        <WKey
          v-for="letter in groupLetters"
          :key="letter"
          :letter="letter"
          :isPress="findLetter(letter)"
          @press="changeLetters"
        ></WKey>
      </div>
      <div class="findWords">
        <label>
          <span>Слово содержит буквы</span>
          <input v-model="positiveLetters" />
        </label>
        <p>* чаще всего встречаются буквы о, е, а, и, н, т, с, р, в, л</p>
        <p>* буквы можно вводить через пробел, запятую или слитно</p>
      </div>
      <div class="signUpCode">
        <p>Указываем букву которую угадали</p>
        <template v-for="(k, i) in positiveInputs" :key="i">
          <input
            v-model="positiveInputs[i]"
            :maxlength="1"
            class="title"
            :id="`code-${i}`"
            :placeholder="(i + 1).toString()"
            @input="addChart(positiveInputs[i])"
          />
        </template>
      </div>
      <div class="signUpCode excludeCharts">
        <p>Буквы есть, но они должны стоять на другом месте</p>
        <template v-for="(k, i) in negativeInputs" :key="i">
          <input
            v-model="negativeInputs[i]"
            :maxlength="length - 1"
            class="title"
            :id="`code-${i}`"
            :placeholder="(i + 1).toString()"
            @input="addChart(negativeInputs[i])"
          />
        </template>
      </div>

      <div class="button_container">
        <button @click="findWords()">Подобрать слова</button>
        <button @click="newWord()">Новое слово</button>
      </div>
      <div>
        <a
          href="https://ru.wikipedia.org/wiki/%D0%A7%D0%B0%D1%81%D1%82%D0%BE%D1%82%D0%BD%D0%BE%D1%81%D1%82%D1%8C"
          target="_blank"
          >Частотность букв русского языка</a
        >
      </div>
      <section>
        <words-found-component :wordsList="wordsList" />
      </section>
    </section>
  </div>
</template>
<script setup lang="ts">
  import words from '@/data/words.json'
  import words1 from '@/data/words1.json'
  import letters from '@/data/letters.json'
  import { type Ref, ref, watch } from 'vue'
  import WordsFoundComponent from './WordsFoundComponent.vue'
  import WKey from '@/components/WKey.vue'

  const length = ref<number>(5)
  const wordsList = ref<string[]>([])
  const negativeLetters = ref<string>('')
  const positiveLetters = ref<string>('')
  const regexSeparator: RegExp = /[а-я]/g
  const positiveInputs = ref<string[]>(new Array<string>(length.value).fill(''))
  const negativeInputs = ref<string[]>(new Array<string>(length.value).fill(''))

  // Сбрасываем значения на дефолтные
  const newWord = () => {
    length.value = 5
    wordsList.value = []
    negativeLetters.value = ''
    positiveLetters.value = ''
    positiveInputs.value = new Array<string>(length.value).fill('')
    negativeInputs.value = new Array<string>(length.value).fill('')
  }

  const findLetter = (letter: string): boolean => {
    return negativeLetters.value.includes(letter)
  }

  const changeLetters = (letters: string) => {
    if (findLetter(letters)) {
      negativeLetters.value = negativeLetters.value
        .trim()
        .split('')
        .filter((l) => l !== letters)
        .join('')
    } else {
      negativeLetters.value = negativeLetters.value.trim() + letters
    }
  }

  watch(length, (newLength) => {
    positiveInputs.value = new Array<string>(+newLength).fill('')
    negativeInputs.value = new Array<string>(+newLength).fill('')
  })

  // Добавляем символы в positive input
  const addChart = (letter: string) => {
    const letters = positiveLetters.value + letter
    const uniqueChart = new Set(letters)
    positiveLetters.value = Array.from(uniqueChart).join('')
  }
  // Конвертируем строку в regexp
  const convertStringToRegexp = (
    str: string,
    separate: string,
    beforeWrap: string,
    afterWrap: string
  ): RegExp => {
    const newStr = str.toLowerCase().match(regexSeparator)?.join(separate) || ''
    return new RegExp(beforeWrap + newStr + afterWrap, 'i')
  }

  // Фильтруем по длине
  const byLength = () => {
    const arrayWords = words1.map((w) => w.toLowerCase())
    const newWords = new Set([...words, ...arrayWords])
    return Array.from(newWords).filter((w: string) => w.length === +length.value)
  }

  // Фильтруем по известным буквам
  const byLetters = (
    letters: Ref<string>,
    type: 'positive' | 'negative'
  ): string[] | [] => {
    if (!letters.value) return wordsList.value
    let regex: RegExp
    if (type === 'positive') {
      regex = convertStringToRegexp(letters.value, ')(?=.*', '(?=.*', ')')
    }
    if (type === 'negative') {
      regex = convertStringToRegexp(letters.value, '|', '', '')
    }
    return wordsList.value.filter((w: string) => {
      if (type === 'positive') return regex.test(w)
      return !regex.test(w)
    })
  }

  // Фильтруем по позиции буквы
  const byPosition = (lettersList: Ref<string[]>, type: 'positive' | 'negative') => {
    if (!lettersList.value.join('')) return wordsList.value
    let fword = [...wordsList.value]
    lettersList.value.forEach((c, i) => {
      fword = fword.filter((w) => {
        return type === 'positive' ? !c || w[i] === c : !c || !c.includes(w[i])
      })
    })
    return fword
  }

  // Ищем слова
  const findWords = () => {
    wordsList.value = byLength()
    wordsList.value = byLetters(negativeLetters, 'negative')
    wordsList.value = byLetters(positiveLetters, 'positive')
    wordsList.value = byPosition(positiveInputs, 'positive')
    wordsList.value = byPosition(negativeInputs, 'negative')
  }
</script>

<style scoped lang="scss">
  .container {
    width: 800px;
    // min-height: 100vh;
    // align-items: center;
    //display: flex;

    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  input {
    border-radius: 5px;
    border: 1px solid #2c2a2a;
    outline: none;
    background-color: #f3f1f1;
    padding-left: 12px;
  }

  .signUpCode {
    margin-top: 20px;

    & > input {
      margin-top: 10px;
      height: 44px;
      width: 44px;
      margin-right: 14px;
      font-size: 36px;
      padding-left: 12px;
      padding-bottom: 6px;
      place-items: center;
      text-transform: lowercase;

      &::placeholder {
        color: #8c8a8a;
        font-size: 9px;
        transform: translate(20px, -20px);
      }
    }

    &.excludeCharts {
      & > input {
        font-size: 10px;

        &::placeholder {
          transform: translate(20px, -10px);
        }
      }
    }
  }

  .findWords {
    margin-top: 10px;

    & label {
      display: flex;
      width: 400px;
    }

    & span {
      flex: 1;
    }

    & input {
      flex: 1;
      height: 39px;
    }

    & p {
      color: #9f9d9d;
      font-size: 14px;
    }
  }

  .button_container {
    display: flex;

    & button {
      width: 100%;
      margin-top: 10px;
      height: 39px;
      place-items: center;
      background-color: #7ee0ac;
      border: 1px solid #4a8365;
      border-radius: 5px;
      margin-left: 10px;

      &:first-child {
        margin-left: 0;
      }
    }
  }
</style>
