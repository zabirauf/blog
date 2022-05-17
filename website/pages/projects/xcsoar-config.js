import siteMetadata from '@/data/siteMetadata'
import { PageSeo } from '@/components/SEO'
import { Fragment, useState, useCallback } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import * as ReactDOM from 'react-dom'

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
]

const CANCEL_BUTTON = {
  name: 'Cancel',
  events: ['Mode default'],
}

const CUSTOM_OPTION_VALUE = 'custom'
const NO_OPTION_VALUE = 'none'
const COMMANDS_INPUT_ID_PREFIX = 'commands-'

export default function About() {
  return (
    <>
      <PageSeo
        title={`About - ${siteMetadata.author}`}
        description={`About me - ${siteMetadata.author}`}
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
  )
}

function XCSoarConfigGenerator() {
  const [blueflyButtons, setBlueflyButtons] = useState([
    DEFAULT_BUTTONS[0],
    DEFAULT_BUTTONS[1],
    DEFAULT_BUTTONS[3],
    CANCEL_BUTTON,
  ])
  const addButton = useCallback(() => {
    openAddButtonDialog((buttonInfo) => setBlueflyButtons([...blueflyButtons, buttonInfo]))
  }, [blueflyButtons])
  return (
    <>
      <div className="flow-root mt-6">
        <ul className="-my-5 divide-y divide-gray-200">
          {blueflyButtons.map((button) => (
            <li key={button.name} className="py-4">
              <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6 flex hover:bg-indigo-50 cursor-pointer">
                <dd className="mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </dd>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">{button.name}</dd>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <button
        type="submit"
        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={addButton}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
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
    </>
  )
}

function openAddButtonDialog(onButtonAddedCallback) {
  const elem = document.createElement('div')
  document.body.appendChild(elem)
  const onDialogClose = () => elem.remove()
  ReactDOM.render(
    <AddButtonDialog onClose={onDialogClose} onButtonAdded={onButtonAddedCallback} />,
    elem
  )
}

function AddButtonDialog(props) {
  const { onClose, onButtonAdded } = props
  const [open, setOpen] = useState(true)
  const [selectedButtonType, setSelectedButtonType] = useState(NO_OPTION_VALUE)
  const [currentSelectedButtonData, setCurrentSelectedButtonData] = useState(null)
  const isCustomSelected = selectedButtonType === CUSTOM_OPTION_VALUE

  const buttonTypeChanged = useCallback((e) => {
    const newlySelectedButtonType = e.target.options[e.target.selectedIndex].value
    setSelectedButtonType(newlySelectedButtonType)

    const buttonData =
      newlySelectedButtonType === CUSTOM_OPTION_VALUE
        ? { name: '', events: [''] }
        : DEFAULT_BUTTONS.filter((b) => b.name === newlySelectedButtonType)[0]
    setCurrentSelectedButtonData(buttonData)
  }, [])

  const closeCallback = useCallback(
    (opened) => {
      setOpen(opened)
      onClose?.()
    },
    [onClose]
  )

  const onNameChange = useCallback(
    (e) => setCurrentSelectedButtonData({ ...currentSelectedButtonData, name: e.target.value }),
    [currentSelectedButtonData]
  )

  const onCommandChange = useCallback(
    (e) => {
      const index = parseInt(e.target.id.split(COMMANDS_INPUT_ID_PREFIX)[1])
      const newSelectedButtonData = { ...currentSelectedButtonData }
      newSelectedButtonData.events[index] = e.target.value

      setCurrentSelectedButtonData(newSelectedButtonData)
    },
    [currentSelectedButtonData]
  )

  const onCommandAdd = useCallback(
    () =>
      setCurrentSelectedButtonData({
        ...currentSelectedButtonData,
        events: [...currentSelectedButtonData.events, ''],
      }),
    [currentSelectedButtonData]
  )
  const onCommandRemove = useCallback(
    (index) => {
      const newEvents = [...currentSelectedButtonData.events]
      newEvents.splice(index, 1)
      setCurrentSelectedButtonData({ ...currentSelectedButtonData, events: newEvents })
    },
    [currentSelectedButtonData]
  )

  const closeDialog = useCallback(() => setOpen(false), [])
  const saveAndClose = useCallback(() => {
    onButtonAdded(currentSelectedButtonData)
    setOpen(false)
  }, [currentSelectedButtonData, onButtonAdded])

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
              <Dialog.Panel className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-4xl sm:w-full sm:p-6">
                <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                  <div className="sm:grid sm:grid-cols-4 sm:gap-4 sm:items-start sm:pt-5">
                    <label
                      htmlFor="button_type"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Type
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-3">
                      <select
                        id="button_type"
                        name="button_type"
                        autoComplete="button-type"
                        className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
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
                          className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
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
                              className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300"
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
                                className="text-base font-medium text-gray-900 sm:text-sm sm:text-gray-700"
                                id="label-commands"
                              >
                                Commands
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <div className="max-w-lg">
                                <p className="text-sm text-gray-500">
                                  These are commands sent to BlueFly when you tap the button.
                                </p>
                                <div className="mt-4 space-y-4">
                                  {currentSelectedButtonData.events.map((evt, idx) => (
                                    <div key={idx} className="flex items-center">
                                      <input
                                        type="text"
                                        name="commands"
                                        id={`${COMMANDS_INPUT_ID_PREFIX}${idx}`}
                                        className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300"
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
  )
}
