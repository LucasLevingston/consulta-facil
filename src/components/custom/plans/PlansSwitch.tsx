import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PlansSwitchProps = {
  onSwitch: (value: string) => void;
};

export const PlansSwitch = ({ onSwitch }: PlansSwitchProps) => (
  <Tabs defaultValue="0" className="w-40 mx-auto" onValueChange={onSwitch}>
    <TabsList className="py-6 px-2">
      <TabsTrigger value="0" className="text-base rounded">
        <p className="text-black dark:text-white">Mensal</p>
      </TabsTrigger>
      <TabsTrigger value="1" className="text-base rounded">
        <p className="text-black dark:text-white">Anual</p>
      </TabsTrigger>
    </TabsList>
  </Tabs>
);
