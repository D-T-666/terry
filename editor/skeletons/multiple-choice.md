# Multiple Choice

```html
<ol>
    <li> <input type="checkbox" id="..."> ... </li>
    <li> <input type="checkbox" id="..."> ... </li>
    <li> <input type="checkbox" id="..."> ... </li>
    <li> <input type="checkbox" id="..."> ... </li>
</ol>
```

```ts
class MultipleChoice {
  constructor(option_ids) {
    this.option_ids = option_ids;
  }

  getValue() {
    const result = [];
    for (const id of this.option_ids) {
      result.push(document.getElementById(id).checked);
    }
    return result;
  }

  getScore(rightAnswers) {
    const value = this.getValue();
    let correct = 0;
    for (let i = 0; i < value.length; i++) {
      correct = value[i] === rightAnswers[i];
    }
    return correct / value.length;
  }
}
```
