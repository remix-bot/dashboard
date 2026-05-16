import { Component, For } from "solid-js";
import { Utils } from "../../../lib/util/Utils";
import { createSignal } from "solid-js";

export type AutocompleteSearchProps = {
  disabled: boolean,
  callback: (query: string) => void
}

const AutocompleteSearch: Component<AutocompleteSearchProps> = (props) => {
  const [autocompletions, setAutocompletions] = createSignal<string[]>([]);

  var runningRequest = false;
  var input!: HTMLInputElement;

  const reset = () => {
    setAutocompletions([]);
    input.value = "";
  }

  const getSuggestions = (query: string): Promise<string[]> => { // fetch suggestion using JSONP
    return new Promise(res => {
      const script = document.createElement("script");
      script.async = true;
      const cname = "suggestion" + (Math.random() + "").replaceAll(".", "");
      // @ts-ignore
      window[cname] = (data) => {
        res(data[1]);
        script.remove();
        // @ts-ignore
        delete window[cname];
      }
      script.src = "https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=" + encodeURIComponent(query) + "&callback=" + cname; // "hl" parameter for locale
      document.head.appendChild(script);
    });
  }

  const keyUpSearch = async (val: string) => {
    if (runningRequest) return;
    runningRequest = true;
    const suggestions = await getSuggestions(val);
    setAutocompletions(suggestions);
    runningRequest = false;
  }

  const queueSearch = async (query: string) => {
    if (Utils.validURL(query)) return props.callback(query);
    props.callback(query);
  }
  return <>
    <div style="position: relative; display: flex; flex-direction: column" class="search-container">
    <input type="text" ref={input} name="search" placeholder="Search or paste a link" autocomplete="off" id="search"
      style="margin: 10px 0 0;
        padding: 5px;
        padding-left: 7px;
        padding-right: 7px;
        align-self: center;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        width: 100%;
        max-width: 400px;
        background-color: rgb(19, 25, 39);
        border-color: #bbb;
        transition: all 0.2s ease-in-out;"
        disabled={props.disabled} onKeyUp={(e) => {
          if (e.code == "Enter") {
            e.preventDefault();
            queueSearch(e.currentTarget.value);
            reset();
            return;
          }
          keyUpSearch(e.currentTarget.value);
      }}/>
    <div style="position: relative; align-self: center; width: 100%">
      <ul id="completions" class="completion-results" style="
        background-color: rgb(19, 25, 39);
        box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.4);
        border-radius: 5px;/*0 0 5px 5px;*/
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        algin-self: center;
        width: 100%;
        max-width: 400px;
        padding: 5px">
          <For each={autocompletions()}>
            {(text: string) => {
              return <>
                <li onClick={() => {
                  queueSearch(text);
                  reset();
                }} class="suggestions-li">{text}</li>
              </>
            }}
          </For>
      </ul>
      </div>
    </div>
  </>
}

export default AutocompleteSearch;
