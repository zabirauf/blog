import siteMetadata from '@/data/siteMetadata';
import { PageSeo } from '@/components/SEO';
import { Fragment, useState, useCallback } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import * as ReactDOM from 'react-dom';

const DEFAULT_BUTTONS = [
  {
    name: 'Vol Up',
    events: ['SendNMEAPort1 BVU'],
  },
  {
    name: 'Vol Down',
    events: ['SendNMEAPort1 BVD'],
  },
  {
    name: 'Sink 1ms',
    events: ['SendNMEAPort1 BFS 100', 'SendNMEAPort1 BOS 100'],
  },
  {
    name: 'Sink 2ms',
    events: ['SendNMEAPort1 BFS 200', 'SendNMEAPort1 BOS 200'],
  },
  {
    name: 'Sink 3ms',
    events: ['SendNMEAPort1 BFS 300', 'SendNMEAPort1 BOS 300'],
  },
  {
    name: 'Test Beep',
    events: [
      'SendNMEAPort1 BSD 1000 500 800 500 600 500 400 2000 1000 500 800 500 600 500 400 2000',
    ],
  },
  {
    name: 'LXMode',
    events: ['SendNMEAPort1 BOM 2', 'SendNMEAPort1 BOF 10'],
  },
  {
    name: 'BFMode',
    events: ['SendNMEAPort1 BTN', 'SendNMEAPort1 BOM 0', 'SendNMEAPort1 BOF 1'],
  },
  {
    name: 'Togg Off',
    events: ['SendNMEAPort1 BTT 2000'],
  },
];

const CANCEL_BUTTON = {
  name: 'Cancel',
  events: ['Mode default'],
};

const CUSTOM_OPTION_VALUE = 'custom';
const NO_OPTION_VALUE = 'none';
const COMMANDS_INPUT_ID_PREFIX = 'commands-';
const DEFAULT_FILE_NAME = 'BlueFly Menu.xci';

export default function About() {
  return (
    <>
      <PageSeo
        title={`About - ${siteMetadata.author}`}
        description={`XCSoar menu configuration generator for BlueFly`}
        url={`${siteMetadata.siteUrl}/xcsoar-bluefly`}
      />
      <div className="divide-y">
        <div className="pt-6 pb-8 space-y-2 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            XCSoar configuration generator
          </h1>
        </div>
        <div className="items-start space-y-2 pt-4">
          <XCSoarConfigGenerator />
        </div>
      </div>
    </>
  );
}

function XCSoarConfigGenerator() {
  const [blueflyButtons, setBlueflyButtons] = useState([
    DEFAULT_BUTTONS[0],
    DEFAULT_BUTTONS[1],
    DEFAULT_BUTTONS[2],
    DEFAULT_BUTTONS[3],
    CANCEL_BUTTON,
  ]);
  const addButton = useCallback(() => {
    openAddButtonDialog((buttonInfo) => setBlueflyButtons([...blueflyButtons, buttonInfo]));
  }, [blueflyButtons]);

  const onButtonRemove = useCallback(
    (idx) => {
      const newBlueflyButtons = [...blueflyButtons];
      newBlueflyButtons.splice(idx, 1);
      setBlueflyButtons(newBlueflyButtons);
    },
    [blueflyButtons]
  );

  const downloadConfig = useCallback(() => {
    generateAndDownloadConfig(blueflyButtons);
  }, [blueflyButtons]);

  const moveButtonUp = useCallback(
    (idx) => {
      const newOrder = [...blueflyButtons];
      if (idx !== 0) {
        const tmp = newOrder[idx];
        newOrder[idx] = newOrder[idx - 1];
        newOrder[idx - 1] = tmp;
        setBlueflyButtons(newOrder);
      }
    },
    [blueflyButtons]
  );
  const moveButtonDown = useCallback(
    (idx) => {
      const newOrder = [...blueflyButtons];
      if (idx !== blueflyButtons.length - 1) {
        const tmp = newOrder[idx];
        newOrder[idx] = newOrder[idx + 1];
        newOrder[idx + 1] = tmp;
        setBlueflyButtons(newOrder);
      }
    },
    [blueflyButtons]
  );

  return (
    <>
      <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-100">
        This generator will help you generate XCSoar menu to configure{' '}
        <a href="https://blueflyvario.com/" target="_blank" rel="noreferrer">
          BlueFly vario
        </a>
      </p>
      <header className="bg-gray-100 dark:bg-gray-700 rounded-md p-4 mb-8">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
          <button
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={addButton}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              />
            </svg>
            Add button
          </button>

          <button
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={downloadConfig}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download config
          </button>
        </nav>
      </header>
      <div className="mt-6">
        <ul className="-my-5 divide-y divide-gray-200">
          {blueflyButtons.map((button, idx) => (
            <li key={button.name} className="py-4 select-none">
              <div className="px-4 py-2 bg-white dark:bg-gray-700 shadow rounded-lg overflow-hidden flex hover:bg-indigo-50">
                <dd className="mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </dd>
                <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {button.name}
                </dd>
                <div className="ml-auto flex">
                  {button.name !== CANCEL_BUTTON.name && (
                    <button
                      type="button"
                      className="bg-white mr-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => onButtonRemove(idx)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                  {idx !== 0 && (
                    <button
                      type="button"
                      className="bg-white mr-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => moveButtonUp(idx)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 11l5-5m0 0l5 5m-5-5v12"
                        />
                      </svg>
                    </button>
                  )}
                  {idx !== blueflyButtons.length - 1 && (
                    <button
                      type="button"
                      className="bg-white mr-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => moveButtonDown(idx)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 13l-5 5m0 0l-5-5m5 5V6"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="text-xs pt-14 text-gray-300 dark:text-gray-500">
        DISCLAIMER: THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
        PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
        BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
        OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
        DEALINGS IN THE SOFTWARE.
      </div>
    </>
  );
}

function generateAndDownloadConfig(buttonsConfig) {
  const lines = [
    '# XCSoar menu for BlueFly',
    '# Generated from https://zabirauf.dev/projects/xcsoar-config',
    '#',
    '',
    '# ******* Entry for top level menu',
    '',
    'mode=Menu',
    'type=key',
    'event=Mode BlueFly',
    'label=BlueFly',
    'location=5',
    '',
    '#',
    '# ******* level 1 *******',
    '#',
  ];

  for (let index = 0; index < buttonsConfig.length; index++) {
    const buttonConfig = buttonsConfig[index];
    lines.push(
      ...[
        'mode=BlueFly',
        'type=key',
        ...buttonConfig.events.map((evt) => `event=${evt}`),
        `label=${buttonConfig.name}`,
        `location=${index + 1}`,
        '',
      ]
    );
  }

  const fileBlob = new Blob(
    lines.map((l) => `${l}\n`),
    { type: 'text/plain' }
  );
  const objUrl = URL.createObjectURL(fileBlob);

  const a = document.createElement('a');
  a.href = objUrl;
  a.download = DEFAULT_FILE_NAME;
  document.body.appendChild(a);
  a.click();

  URL.revokeObjectURL(objUrl);
  a.remove();
}

function openAddButtonDialog(onButtonAddedCallback) {
  const elem = document.createElement('div');
  document.body.appendChild(elem);
  const onDialogClose = () => elem.remove();
  ReactDOM.render(
    <AddButtonDialog onClose={onDialogClose} onButtonAdded={onButtonAddedCallback} />,
    elem
  );
}

function AddButtonDialog(props) {
  const { onClose, onButtonAdded } = props;
  const [open, setOpen] = useState(true);
  const [selectedButtonType, setSelectedButtonType] = useState(NO_OPTION_VALUE);
  const [currentSelectedButtonData, setCurrentSelectedButtonData] = useState(null);
  const isCustomSelected = selectedButtonType === CUSTOM_OPTION_VALUE;

  const buttonTypeChanged = useCallback((e) => {
    const newlySelectedButtonType = e.target.options[e.target.selectedIndex].value;
    setSelectedButtonType(newlySelectedButtonType);

    const buttonData =
      newlySelectedButtonType === CUSTOM_OPTION_VALUE
        ? { name: '', events: [''] }
        : DEFAULT_BUTTONS.filter((b) => b.name === newlySelectedButtonType)[0];
    setCurrentSelectedButtonData(buttonData);
  }, []);

  const closeCallback = useCallback(
    (opened) => {
      setOpen(opened);
      onClose?.();
    },
    [onClose]
  );

  const onNameChange = useCallback(
    (e) => setCurrentSelectedButtonData({ ...currentSelectedButtonData, name: e.target.value }),
    [currentSelectedButtonData]
  );

  const onCommandChange = useCallback(
    (e) => {
      const index = parseInt(e.target.id.split(COMMANDS_INPUT_ID_PREFIX)[1]);
      const newSelectedButtonData = { ...currentSelectedButtonData };
      newSelectedButtonData.events[index] = e.target.value;

      setCurrentSelectedButtonData(newSelectedButtonData);
    },
    [currentSelectedButtonData]
  );

  const onCommandAdd = useCallback(
    () =>
      setCurrentSelectedButtonData({
        ...currentSelectedButtonData,
        events: [...currentSelectedButtonData.events, ''],
      }),
    [currentSelectedButtonData]
  );
  const onCommandRemove = useCallback(
    (index) => {
      const newEvents = [...currentSelectedButtonData.events];
      newEvents.splice(index, 1);
      setCurrentSelectedButtonData({ ...currentSelectedButtonData, events: newEvents });
    },
    [currentSelectedButtonData]
  );

  const closeDialog = useCallback(() => setOpen(false), []);
  const saveAndClose = useCallback(() => {
    // Filtering any empty command
    const filteredButtonData = { ...currentSelectedButtonData };
    filteredButtonData.events = filteredButtonData.events.filter((evt) => evt.trim() !== '');
    onButtonAdded(filteredButtonData);
    setOpen(false);
  }, [currentSelectedButtonData, onButtonAdded]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeCallback}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-white dark:bg-gray-700 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-4xl sm:w-full sm:p-6">
                <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                  <div className="sm:grid sm:grid-cols-4 sm:gap-4 sm:items-start sm:pt-5">
                    <label
                      htmlFor="button_type"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-100 sm:mt-px sm:pt-2"
                    >
                      Type
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-3">
                      <select
                        id="button_type"
                        name="button_type"
                        autoComplete="button-type"
                        className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 dark:border-white dark:bg-gray-800 rounded-md"
                        onChange={buttonTypeChanged}
                      >
                        <option value={NO_OPTION_VALUE}>Please select a type</option>
                        {DEFAULT_BUTTONS.map(({ name }) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                        <option value={CUSTOM_OPTION_VALUE}>Custom</option>
                      </select>
                    </div>
                  </div>

                  {currentSelectedButtonData && (
                    <>
                      <div className="sm:grid sm:grid-cols-4 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-100 sm:mt-px sm:pt-2"
                        >
                          Name
                        </label>
                        <div className="mt-1 sm:mt-0 sm:col-span-3">
                          <div className="max-w-lg flex rounded-md shadow-sm">
                            <input
                              type="text"
                              name="name"
                              id="name"
                              autoComplete="name"
                              className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300 dark:bg-gray-800"
                              value={currentSelectedButtonData.name}
                              onChange={onNameChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 sm:pt-5">
                        <div role="group" aria-labelledby="label-commands">
                          <div className="sm:grid sm:grid-cols-4 sm:gap-4 sm:items-baseline">
                            <div>
                              <div
                                className="text-base font-medium text-gray-700 dark:text-gray-100 sm:text-sm sm:text-gray-700 sm:dark:text-gray-100"
                                id="label-commands"
                              >
                                Commands
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <div className="max-w-lg">
                                <p className="text-sm text-gray-500 dark:text-gray-100">
                                  These are commands sent to BlueFly when you tap the button.
                                </p>
                                <div className="mt-4 space-y-4">
                                  {currentSelectedButtonData.events.map((evt, idx) => (
                                    <div key={idx} className="flex items-center">
                                      <input
                                        type="text"
                                        name="commands"
                                        id={`${COMMANDS_INPUT_ID_PREFIX}${idx}`}
                                        className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300 dark:bg-gray-800"
                                        value={evt}
                                        onChange={onCommandChange}
                                      />
                                      <button
                                        type="button"
                                        className="bg-white py-2 ml-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        onClick={() => onCommandRemove(idx)}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-5 w-5"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                  ))}
                                  <div className="flex items-center">
                                    <button
                                      type="button"
                                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                      onClick={onCommandAdd}
                                    >
                                      Add Command
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="pt-5 sm:border-t sm:border-gray-200">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={closeDialog}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={saveAndClose}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
