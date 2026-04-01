import { Component, For, Show } from "solid-js";

export type CommandProps = {
  name: string,
  description: string,
  aliases: string[],
  options: {
    type: string,
    choices: string[],
    name: string
  }[],
  uid: string,
  usage: string
}

const Command: Component<CommandProps> = (props: CommandProps) => {
  return <>
    <div style="width: fit-content; display: inline; " id={props.uid}>
    <h2>
        {props.name}

      <Show when={props.aliases.length > 1}>
        <sub>{props.aliases.filter(a => a != props.name).join(", ")}</sub>
      </Show>
    </h2>
    <p>
      {props.description}
    </p>
    <div>
      <code style="display: flex; flex-direction: row; gap: 0.6rem; align-items: center; width: fit-content">
        {import.meta.env.VITE_PREFIX + props.name}
        <For each={props.options}>
          {(option) => {
            return <>
              <Show when={option.type === "choice"}>
                <div>
                  <For each={option.choices}>
                    {(choice) => {
                      return <span>choice</span>
                    }}
                  </For>
                </div>
                <span style="font-size: 70%">{option.name}</span>
                <div style="display: block">
                  <span>{option.choices.join("/")}</span>
                  <sup style="font-size: 60%">{option.name}</sup>
                </div>
              </Show>
              <span style="color: <%= colorMapping[option.type] %>">{option.name}</span>
            </>
          }}
        </For>
      </code>
      </div>
    </div>
  </>
}

export default Command;
