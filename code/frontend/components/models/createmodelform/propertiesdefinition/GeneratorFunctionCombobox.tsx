import { useState } from 'react'
import { Combobox } from '@headlessui/react'

const generatorFunctions = ["Random", "Sine wave", "Sawtooth", "Replay"]

const GeneratorFunctionCombobox = () => {
  const [selectedFunction, setSelectedFunction] = useState(generatorFunctions[0])
  const [query, setQuery] = useState('')

  const filteredFunctions =
    query === ''
      ? generatorFunctions
      : generatorFunctions.filter((genFunction) => {
          return genFunction.toLowerCase().includes(query.toLowerCase())
    })

  return (
    <Combobox value={selectedFunction} onChange={setSelectedFunction}>
        <div className="flex flex-col gap-y-1">
            <Combobox.Input onChange={(event) => setQuery(event.target.value)} placeholder="Select generator function" className="w-[95.65%] p-2 rounded-lg border-2 border-[#DADADA] text-[#494949] text-medium placeholder-gray-400 "/>
            <Combobox.Options className="w-[95.65%] rounded-lg border-2 border-[#DADADA] text-gray-400 placeholder-gray-400 text-medium">
                {filteredFunctions.map((genFunction) => (
                    <Combobox.Option key={genFunction} value={genFunction} className="text-sm hover:bg-gray-100 pl-3 p-1.5 cursor-pointer">
                    {genFunction}
                    </Combobox.Option>
                ))}
            </Combobox.Options>
        </div>

  </Combobox>
  )
}

export default GeneratorFunctionCombobox;