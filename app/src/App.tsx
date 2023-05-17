import { Suspense, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListTasks,
  getListTasksQueryKey,
  useUpdateTask,
  useCreateTask,
  useDeleteTask,
} from "./generated";
import { style } from "@macaron-css/core";
import { Button } from "./Button";

const TodoList = () => {
  const [editTodoId, setEditTodoId] = useState<string | undefined>();
  const [inputText, setInputText] = useState<string | undefined>(undefined);

  const queryClient = useQueryClient();
  const { data } = useListTasks();
  const { mutate } = useUpdateTask({
    mutation: {
      onSuccess: (result) => {
        const additionalTask = result.data.task;

        queryClient.setQueryData(getListTasksQueryKey(), (prevState: any) => {
          const prevTaskList = prevState.data.tasks;

          const nextTaskList = prevTaskList.map((task) => {
            if (task.id === additionalTask.id) return additionalTask;
            return task;
          });

          const nextState = {
            ...prevState,
            data: { tasks: nextTaskList },
          };
          setEditTodoId(undefined);

          return nextState;
        });
      },
    },
  });

  return (
    <ul className={style({ marginTop: "25px", paddingLeft: "0" })}>
      {data.data.tasks.map((task) => {
        if (task.id === editTodoId) {
          return (
            <li
              key={task.id}
              className={style({
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "15px",
                borderBottom: "1px solid #EBEBEB",
              })}
            >
              <input
                value={inputText === undefined ? task.title : inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <div>
                <Button
                  color="netoral"
                  size="smallest"
                  onClick={() => {
                    setInputText(undefined);
                    setEditTodoId(undefined);
                  }}
                >
                  キャンセル
                </Button>
                <Button
                  color="netoral"
                  size="smallest"
                  onClick={() => {
                    mutate({ taskId: task.id, data: { title: inputText } });
                    setInputText(undefined);
                    setEditTodoId(undefined);
                  }}
                >
                  決定
                </Button>
              </div>
            </li>
          );
        }

        return (
          <li
            className={style({
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "15px",
              borderBottom: "1px solid #EBEBEB",
            })}
            key={task.id}
          >
            <div className={style({ display: "flex", flexDirection: "row" })}>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  const date = new Date();
                  mutate({
                    taskId: task.id,
                    data: { finishedAt: date.toJSON() },
                  });
                }}
                color="netoral"
                size="smallest"
                className={style({ alignSelf: "center" })}
              >
                完了
              </Button>
              <p
                className={style({
                  paddingLeft: "15px",
                  listStyle: "none",
                })}
              >
                <span
                  style={{
                    textDecorationLine: task.finishedAt ? "line-through" : "",
                  }}
                >
                  {task.title}
                </span>
              </p>
            </div>
            <Button
              onClick={(e) => {
                e.preventDefault();
                setEditTodoId(task.id);
              }}
              color="netoral"
              size="smallest"
            >
              編集
            </Button>
          </li>
        );
      })}
    </ul>
  );
};

export const App = () => {
  const queryClient = useQueryClient();

  const { mutate } = useCreateTask({
    mutation: {
      onSuccess: (result) => {
        queryClient.setQueryData(getListTasksQueryKey(), (prevState: any) => {
          const prevTaskList = prevState.data.tasks;
          const nextState = {
            ...prevState,
            data: { tasks: [...prevTaskList, result.data.task] },
          };

          return nextState;
        });
      },
    },
  });

  return (
    <main
      className={style({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: "#F8F8F8",
      })}
    >
      <div
        className={style({
          width: "40%",
          border: "1px solid #EBEBEB",
          backgroundColor: "#FFFFFF",
          borderRadius: "3px",
        })}
      >
        <h1
          className={style({
            fontSize: "20px",
            fontWeight: "bold",
            paddingBottom: "15px",
            borderBottom: "1px solid #EBEBEB",
            padding: "15px",
          })}
        >
          Todo List
        </h1>
        <Button
          color="netoral"
          size="small"
          className={style({ marginLeft: "15px" })}
          onClick={(e) => {
            e.preventDefault();
            mutate();
          }}
        >
          ToDoを作成
        </Button>
        <Suspense fallback={<div>Now Loading...</div>}>
          <TodoList />
        </Suspense>
      </div>
    </main>
  );
};
